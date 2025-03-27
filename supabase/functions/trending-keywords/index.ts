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
    const { topic, industry } = await req.json();

    // Mock trending keywords data
    // In production, this would call external APIs or your own keyword research service
    const keywords = [
      { keyword: `${topic.toLowerCase()}tips`, volume: 1200, trending: true },
      { keyword: `${industry.toLowerCase()}trends`, volume: 800, trending: true },
      { keyword: `${topic.toLowerCase()}guide`, volume: 600, trending: false },
      { keyword: `${industry.toLowerCase()}insights`, volume: 500, trending: true },
      { keyword: `${topic.toLowerCase()}strategy`, volume: 400, trending: false },
      { keyword: `${industry.toLowerCase()}news`, volume: 300, trending: true },
      { keyword: `${topic.toLowerCase()}examples`, volume: 250, trending: false },
      { keyword: `${industry.toLowerCase()}best`, volume: 200, trending: true },
      { keyword: `${topic.toLowerCase()}tools`, volume: 150, trending: false },
      { keyword: `${industry.toLowerCase()}top`, volume: 100, trending: true },
    ];

    return new Response(
      JSON.stringify({ keywords }),
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