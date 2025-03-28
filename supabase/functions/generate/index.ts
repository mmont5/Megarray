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
    const { type, topic, industry, keywords, humanize, language } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user's subscription tier for rate limiting
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plans(name)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    // Check rate limits
    const { data: usageData } = await supabase
      .from('usage')
      .select('amount')
      .eq('user_id', user.id)
      .eq('type', 'ai_generation')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single();

    const dailyLimit = subscription?.plans?.name === 'Enterprise' ? -1 :
                      subscription?.plans?.name === 'Business' ? 1000 :
                      subscription?.plans?.name === 'Pro' ? 500 : 100;

    if (dailyLimit !== -1 && (usageData?.amount || 0) >= dailyLimit) {
      throw new Error('Daily generation limit exceeded');
    }

    // Generate content with OpenAI
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
      .from('usage')
      .insert({
        user_id: user.id,
        type: 'ai_generation',
        amount: 1,
        metadata: {
          content_type: type,
          language,
          humanized: humanize,
        },
      });

    // Store generation history
    await supabase
      .from('content_generations')
      .insert({
        user_id: user.id,
        content,
        metadata: {
          type,
          topic,
          industry,
          keywords,
          language,
          humanized: humanize,
        },
      });

    return new Response(
      JSON.stringify({ content }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});