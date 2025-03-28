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

    const { type, topic, industry, keywords, language = 'en', humanize = false } = await req.json();

    // Get user's subscription tier for rate limiting
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plans(name)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    // Check usage limits
    const { data: usageData } = await supabase
      .from('subscription_usage')
      .select('used_amount, max_allowed')
      .eq('subscription_id', subscription?.id)
      .eq('feature', 'ai_generation')
      .single();

    if (usageData && usageData.max_allowed !== -1 && usageData.used_amount >= usageData.max_allowed) {
      throw new Error('AI generation limit reached');
    }

    // Generate content
    const prompt = `Create a ${type} about ${topic} in the ${industry} industry.
Include these keywords: ${keywords.join(', ')}.
Make it engaging and natural-sounding.
Language: ${language}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert marketing content creator with deep knowledge of digital marketing and content strategy."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    let content = completion.choices[0].message.content || '';

    // Humanize if requested
    if (humanize) {
      const humanizedCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert at making AI-generated content sound more human and natural."
          },
          {
            role: "user",
            content: `Make this content sound more natural and human-like, while maintaining its professional tone: ${content}`
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      });

      content = humanizedCompletion.choices[0].message.content || content;
    }

    // Track usage
    await supabase
      .from('subscription_usage')
      .upsert({
        subscription_id: subscription?.id,
        feature: 'ai_generation',
        used_amount: (usageData?.used_amount || 0) + 1,
        max_allowed: usageData?.max_allowed || 100,
      });

    // Store generation history
    const { data: generation, error: generationError } = await supabase
      .from('content_generations')
      .insert({
        content,
        prompt_id: null,
        agency_id: null,
        metadata: {
          type,
          topic,
          industry,
          keywords,
          language,
          humanized: humanize,
        },
      })
      .select()
      .single();

    if (generationError) throw generationError;

    return new Response(
      JSON.stringify({ content, generationId: generation.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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