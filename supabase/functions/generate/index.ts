import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import OpenAI from 'npm:openai@4.28.0';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user and verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Please log in to generate content' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    const { topic, type = 'post', platform = 'general', tone = 'professional' } = await req.json();
    
    if (!topic?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Topic is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check user's subscription and usage limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plans(name)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    const { data: usage } = await supabase
      .from('subscription_usage')
      .select('used_amount, max_allowed')
      .eq('subscription_id', subscription?.id)
      .eq('feature', 'ai_credits')
      .single();

    if (usage && usage.max_allowed !== -1 && usage.used_amount >= usage.max_allowed) {
      return new Response(
        JSON.stringify({ error: 'AI generation limit reached' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Build the prompt based on content type and platform
    const systemPrompt = `You are an expert marketing content creator specializing in ${platform} content.
Your task is to create engaging, platform-optimized content that follows best practices and drives engagement.

Content Guidelines:
- Type: ${type}
- Platform: ${platform}
- Tone: ${tone}
- Length: Appropriate for ${platform} (e.g., short for Twitter, longer for blog posts)
- Style: Natural, engaging, and authentic
- Include: Relevant hashtags, emojis (if appropriate), and calls-to-action

Focus on:
- Clear value proposition
- Engaging opening
- Natural language
- Platform-specific formatting
- SEO optimization (where applicable)
- Call-to-action`;

    const userPrompt = `Create ${type} content about "${topic}" for ${platform}.
Make it engaging and natural-sounding, optimized for the platform.
Use a ${tone} tone.`;

    // Generate content with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error('No content generated');
    }

    // Track usage
    if (usage) {
      await supabase
        .from('subscription_usage')
        .update({ 
          used_amount: usage.used_amount + 1,
          updated_at: new Date().toISOString()
        })
        .eq('subscription_id', subscription?.id)
        .eq('feature', 'ai_credits');
    }

    // Store generation history
    await supabase
      .from('content_generations')
      .insert({
        user_id: user.id,
        prompt: { topic, type, platform, tone },
        content,
        metadata: {
          model: 'gpt-4',
          platform,
          type,
          subscription_tier: subscription?.plans?.name || 'free'
        }
      });

    return new Response(
      JSON.stringify({ content }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Generation error:', error);
    
    // Handle OpenAI API errors
    if (error?.response?.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Handle missing API key
    if (error.message?.includes('API key')) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API configuration error. Please contact support.' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate content' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});