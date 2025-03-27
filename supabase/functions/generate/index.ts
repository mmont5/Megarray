import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, topic, industry, keywords, humanize } = await req.json();

    // Mock content generation
    // In production, this would call OpenAI, Azure, or Claude APIs
    const content = `Here's a ${type} about ${topic} in the ${industry} industry.

Key points:
${keywords.map((kw: string) => `- ${kw}`).join('\n')}

This content has been automatically generated and ${humanize ? 'humanized' : 'not humanized'} for natural tone and style.`;

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