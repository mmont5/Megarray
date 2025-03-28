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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { message, language = 'en', context = [] } = await req.json();

    // Get user's preferences and history
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get relevant knowledge base articles
    const { data: articles } = await supabase
      .from('knowledge_base')
      .select('*')
      .textSearch('content', message)
      .limit(3);

    // Build system message with context
    const systemMessage = `You are an AI marketing assistant with expertise in:
- Content creation and optimization
- Social media marketing
- Email marketing
- Analytics and reporting
- Ad campaign management

User preferences:
${JSON.stringify(preferences, null, 2)}

Relevant knowledge base articles:
${articles?.map(a => a.title + ': ' + a.summary).join('\n')}

Please respond in ${language}.`;

    // Generate response
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        ...context.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;

    // Store conversation history
    await supabase
      .from('assistant_conversations')
      .insert({
        user_id: user.id,
        message,
        response,
        language,
      });

    return new Response(
      JSON.stringify({ response }),
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