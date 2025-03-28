import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { topic } = body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing topic parameter' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError?.message }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get user's subscription tier
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plans(name)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    // Determine keyword limit based on subscription
    const keywordLimit = subscription?.plans?.name === 'Free' ? 5 :
                        subscription?.plans?.name === 'Pro' ? 10 : 20;

    // Generate trending data
    const normalizedTopic = topic.trim().toLowerCase();
    const keywords = [
      { keyword: `${normalizedTopic} tips`, volume: 1200, trending: true },
      { keyword: `${normalizedTopic} guide`, volume: 800, trending: false },
      { keyword: `${normalizedTopic} examples`, volume: 600, trending: true },
      { keyword: `${normalizedTopic} best practices`, volume: 500, trending: false },
      { keyword: `${normalizedTopic} tutorial`, volume: 450, trending: true },
      { keyword: `${normalizedTopic} tools`, volume: 400, trending: false },
      { keyword: `#${normalizedTopic}tips`, volume: 2500, trending: true },
      { keyword: `#${normalizedTopic}`, volume: 2000, trending: true },
      { keyword: `#${normalizedTopic}guide`, volume: 1500, trending: false },
      { keyword: `#${normalizedTopic}expert`, volume: 1200, trending: true },
    ];

    // Limit results based on subscription
    const limitedKeywords = keywords.slice(0, keywordLimit);

    // Track usage
    await supabase.from('subscription_usage').upsert({
      subscription_id: subscription?.id,
      feature: 'keyword_searches',
      used_amount: 1,
      max_allowed: keywordLimit,
      reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return new Response(
      JSON.stringify({
        keywords: limitedKeywords,
        _metadata: {
          limit: keywordLimit,
          subscription: subscription?.plans?.name || 'free',
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Trending keywords error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});