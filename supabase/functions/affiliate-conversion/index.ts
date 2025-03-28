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

    const { linkId, userId, planId, amount } = await req.json();

    // Get affiliate link details
    const { data: linkData, error: linkError } = await supabase
      .from('affiliate_links')
      .select('commission_rate')
      .eq('id', linkId)
      .single();

    if (linkError || !linkData) {
      throw new Error('Invalid affiliate link');
    }

    const commissionAmount = amount * linkData.commission_rate;

    // Record conversion
    const { data: conversionData, error: conversionError } = await supabase
      .from('affiliate_conversions')
      .insert({
        link_id: linkId,
        referred_user_id: userId,
        plan_id: planId,
        amount,
        commission_amount: commissionAmount,
        status: 'completed',
      })
      .select()
      .single();

    if (conversionError) {
      throw conversionError;
    }

    return new Response(
      JSON.stringify(conversionData),
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