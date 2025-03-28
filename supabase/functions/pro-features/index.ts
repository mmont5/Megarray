import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CustomTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  content: z.string(),
  variables: z.array(z.string()),
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

    // Verify pro subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plans(name)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    const isPro = ['Pro', 'Business', 'Enterprise'].includes(subscription?.plans?.name ?? '');
    if (!isPro) {
      throw new Error('Pro subscription required');
    }

    switch (req.method) {
      case 'POST': {
        const { feature } = await req.json();

        switch (feature) {
          case 'custom_template': {
            const templateData = CustomTemplateSchema.parse(await req.json());
            
            const { data, error } = await supabase
              .from('content_templates')
              .insert({
                ...templateData,
                user_id: user.id,
              })
              .select()
              .single();

            if (error) throw error;

            return new Response(
              JSON.stringify(data),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          case 'team_member': {
            const { email, role } = await req.json();

            // Check team size limit
            const { data: teamCount } = await supabase
              .from('team_members')
              .select('count', { count: 'exact' })
              .eq('user_id', user.id);

            if (subscription?.plans?.name === 'Pro' && teamCount >= 3) {
              throw new Error('Team size limit reached (max 3 members for Pro plan)');
            }

            const { data, error } = await supabase
              .from('team_members')
              .insert({
                user_id: user.id,
                email,
                role,
                status: 'pending',
              })
              .select()
              .single();

            if (error) throw error;

            // Send invitation email
            await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: email,
                template: 'team-invitation',
                data: {
                  invitationId: data.id,
                  role,
                },
              }),
            });

            return new Response(
              JSON.stringify(data),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          default:
            throw new Error('Unknown pro feature');
        }
      }

      case 'GET': {
        const { feature } = new URL(req.url).searchParams;

        switch (feature) {
          case 'custom_templates': {
            const { data, error } = await supabase
              .from('content_templates')
              .select('*')
              .eq('user_id', user.id);

            if (error) throw error;

            return new Response(
              JSON.stringify(data),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          case 'team_members': {
            const { data, error } = await supabase
              .from('team_members')
              .select('*')
              .eq('user_id', user.id);

            if (error) throw error;

            return new Response(
              JSON.stringify(data),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          default:
            throw new Error('Unknown pro feature');
        }
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