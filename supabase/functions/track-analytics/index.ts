import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

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

    const { contentId, metricType, value, platform } = await req.json();

    // Get content details
    const { data: content, error: contentError } = await supabase
      .from('content_items')
      .select('agency_id')
      .eq('id', contentId)
      .single();

    if (contentError) throw contentError;

    // Record metric
    const { data, error } = await supabase
      .from('content_analytics')
      .insert({
        content_id: contentId,
        metric_type: metricType,
        value,
        platform,
        agency_id: content.agency_id,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
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
      }
    );
  }
});