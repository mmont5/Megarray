import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { TwitterApi } from 'npm:twitter-api-v2@1.15.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const X_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAETw0AEAAAAAebapm0vcfH2mWUI%2F56McHkQjb%2BY%3DxkCWWyStbtZQ3GXjQUAP1TMKX5AJMdfHWpZnwQJvkJOU9L5SRL';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate request body
    const body = await req.json().catch(() => ({}));
    const { topic } = body;

    if (!topic || typeof topic !== 'string') {
      throw new Error('Invalid or missing topic parameter');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user's subscription tier
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('plans(name)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (subError && subError.code !== 'PGRST116') {
      console.error('Subscription error:', subError);
      throw new Error('Failed to verify subscription');
    }

    // Determine keyword limit based on subscription
    const keywordLimit = subscription?.plans?.name === 'free' ? 5 :
                        subscription?.plans?.name === 'pro' ? 10 : 20;

    // Initialize X API client
    const xClient = new TwitterApi(X_BEARER_TOKEN);

    // Generate trending data
    // In production, replace with actual API calls to X, Google Trends, etc.
    const keywords = [
      { keyword: `${topic.toLowerCase()} tips`, volume: 1200, trending: true },
      { keyword: `${topic.toLowerCase()} guide`, volume: 800, trending: false },
      { keyword: `${topic.toLowerCase()} examples`, volume: 600, trending: true },
      { keyword: `${topic.toLowerCase()} best practices`, volume: 500, trending: false },
      { keyword: `${topic.toLowerCase()} tutorial`, volume: 450, trending: true },
      { keyword: `${topic.toLowerCase()} tools`, volume: 400, trending: false },
      { keyword: `#${topic.toLowerCase()}tips`, volume: 2500, trending: true },
      { keyword: `#${topic.toLowerCase()}`, volume: 2000, trending: true },
      { keyword: `#${topic.toLowerCase()}guide`, volume: 1500, trending: false },
      { keyword: `#${topic.toLowerCase()}expert`, volume: 1200, trending: true },
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
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Trending keywords error:', error);
    
    const status = error.message === 'Unauthorized' ? 401 :
                  error.message === 'Invalid or missing topic parameter' ? 400 : 500;
                  
    return new Response(
      JSON.stringify({
        error: error.message,
        details: status === 500 ? 'Internal server error' : error.message,
      }),
      {
        status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});