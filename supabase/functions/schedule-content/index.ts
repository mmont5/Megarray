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

    const { contentId, scheduledTime, timezone } = await req.json();

    // Get content details
    const { data: content, error: contentError } = await supabase
      .from('content_items')
      .select('*, agencies(*)')
      .eq('id', contentId)
      .single();

    if (contentError) throw contentError;

    // Create schedule record
    const { data: schedule, error: scheduleError } = await supabase
      .from('content_schedules')
      .insert({
        content_id: contentId,
        scheduled_time: scheduledTime,
        timezone: timezone || 'UTC',
        status: 'pending'
      })
      .select()
      .single();

    if (scheduleError) throw scheduleError;

    // Update content status
    const { error: updateError } = await supabase
      .from('content_items')
      .update({ status: 'scheduled' })
      .eq('id', contentId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify(schedule),
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