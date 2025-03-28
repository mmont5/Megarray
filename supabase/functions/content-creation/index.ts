import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import OpenAI from 'npm:openai@4.28.0';
import { z } from 'npm:zod@3.22.4';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ContentSchema = z.object({
  type: z.enum(['post', 'blog', 'email', 'video_script', 'ad_copy', 'newsletter']),
  title: z.string(),
  content: z.string(),
  platform: z.string().optional(),
  language: z.string().default('en'),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  useAI: z.boolean().default(false),
  aiPrompt: z.object({
    topic: z.string(),
    tone: z.string(),
    keywords: z.array(z.string()),
    length: z.number(),
  }).optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    switch (req.method) {
      case 'POST': {
        const contentData = ContentSchema.parse(await req.json());

        let finalContent = contentData.content;

        // Generate content with AI if requested
        if (contentData.useAI && contentData.aiPrompt) {
          // Check user's AI generation limits
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plans(name, limits)')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          const aiLimit = subscription?.plans?.limits?.ai_generations ?? 100;
          
          if (aiLimit !== -1) {
            const { count } = await supabase
              .from('content_generations')
              .select('count', { count: 'exact' })
              .eq('user_id', user.id)
              .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

            if (count >= aiLimit) {
              throw new Error('AI generation limit reached');
            }
          }

          // Generate content
          const prompt = `Create a ${contentData.type} about ${contentData.aiPrompt.topic}.
Tone: ${contentData.aiPrompt.tone}
Keywords to include: ${contentData.aiPrompt.keywords.join(', ')}
Target length: ${contentData.aiPrompt.length} words
Language: ${contentData.language}`;

          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert content creator specializing in marketing and engagement."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2000,
          });

          finalContent = completion.choices[0].message.content || contentData.content;

          // Track AI generation
          await supabase
            .from('content_generations')
            .insert({
              user_id: user.id,
              type: contentData.type,
              prompt: contentData.aiPrompt,
              result: finalContent,
            });
        }

        // Create content item
        const { data: content, error: contentError } = await supabase
          .from('content_items')
          .insert({
            creator_id: user.id,
            type: contentData.type,
            title: contentData.title,
            content: finalContent,
            platform: contentData.platform,
            language: contentData.language,
            metadata: contentData.metadata,
            status: 'draft',
          })
          .select()
          .single();

        if (contentError) throw contentError;

        // Add tags if provided
        if (contentData.tags?.length) {
          const { error: tagsError } = await supabase
            .from('content_item_tags')
            .insert(
              contentData.tags.map(tagId => ({
                content_id: content.id,
                tag_id: tagId,
              }))
            );

          if (tagsError) throw tagsError;
        }

        // Create approval flow if needed
        const { data: agency } = await supabase
          .from('agency_members')
          .select('agency_id, role')
          .eq('user_id', user.id)
          .single();

        if (agency && agency.role !== 'admin') {
          await supabase
            .from('content_approval_flows')
            .insert({
              content_id: content.id,
              agency_id: agency.agency_id,
              status: 'pending',
              approvers: await getAgencyApprovers(agency.agency_id),
            });
        }

        return new Response(
          JSON.stringify(content),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'GET': {
        const { contentId } = Object.fromEntries(
          new URL(req.url).searchParams.entries()
        );

        if (contentId) {
          // Get specific content item
          const { data: content, error } = await supabase
            .from('content_items')
            .select(`
              *,
              creator:profiles(*),
              tags:content_item_tags(
                tag:content_tags(*)
              ),
              approval_flow:content_approval_flows(*),
              analytics:content_analytics(*)
            `)
            .eq('id', contentId)
            .single();

          if (error) throw error;

          return new Response(
            JSON.stringify(content),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // List content items
          const { data: contents, error } = await supabase
            .from('content_items')
            .select(`
              *,
              creator:profiles(name),
              tags:content_item_tags(
                tag:content_tags(name)
              )
            `)
            .eq('creator_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(
            JSON.stringify(contents),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      case 'PUT': {
        const { contentId, ...updateData } = ContentSchema.parse(await req.json());

        // Verify ownership or permissions
        const { data: content } = await supabase
          .from('content_items')
          .select('creator_id, agency_id')
          .eq('id', contentId)
          .single();

        if (!content) throw new Error('Content not found');

        const canEdit = content.creator_id === user.id || await hasEditPermission(user.id, content.agency_id);
        if (!canEdit) throw new Error('Permission denied');

        // Update content
        const { data: updatedContent, error } = await supabase
          .from('content_items')
          .update({
            title: updateData.title,
            content: updateData.content,
            platform: updateData.platform,
            language: updateData.language,
            metadata: updateData.metadata,
            updated_at: new Date().toISOString(),
          })
          .eq('id', contentId)
          .select()
          .single();

        if (error) throw error;

        // Update tags if provided
        if (updateData.tags) {
          await supabase
            .from('content_item_tags')
            .delete()
            .eq('content_id', contentId);

          if (updateData.tags.length > 0) {
            await supabase
              .from('content_item_tags')
              .insert(
                updateData.tags.map(tagId => ({
                  content_id: contentId,
                  tag_id: tagId,
                }))
              );
          }
        }

        return new Response(
          JSON.stringify(updatedContent),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'DELETE': {
        const { contentId } = await req.json();

        // Verify ownership or permissions
        const { data: content } = await supabase
          .from('content_items')
          .select('creator_id, agency_id')
          .eq('id', contentId)
          .single();

        if (!content) throw new Error('Content not found');

        const canDelete = content.creator_id === user.id || await hasEditPermission(user.id, content.agency_id);
        if (!canDelete) throw new Error('Permission denied');

        const { error } = await supabase
          .from('content_items')
          .delete()
          .eq('id', contentId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response('Method not allowed', { status: 405 });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: error.message === 'Unauthorized' ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function getAgencyApprovers(agencyId: string): Promise<string[]> {
  const { data: admins } = await supabase
    .from('agency_members')
    .select('user_id')
    .eq('agency_id', agencyId)
    .eq('role', 'admin');

  return admins?.map(admin => admin.user_id) || [];
}

async function hasEditPermission(userId: string, agencyId: string | null): Promise<boolean> {
  if (!agencyId) return false;

  const { data: membership } = await supabase
    .from('agency_members')
    .select('role')
    .eq('agency_id', agencyId)
    .eq('user_id', userId)
    .single();

  return membership?.role === 'admin' || membership?.role === 'manager';
}