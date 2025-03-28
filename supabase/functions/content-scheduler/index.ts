import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ScheduleSchema = z.object({
  contentId: z.string().uuid(),
  scheduledTime: z.string().datetime(),
  timezone: z.string().default('UTC'),
  platform: z.string(),
});

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

    switch (req.method) {
      case 'POST': {
        const scheduleData = ScheduleSchema.parse(await req.json());

        // Create schedule
        const { data: schedule, error: scheduleError } = await supabase
          .from('content_schedules')
          .insert({
            content_id: scheduleData.contentId,
            scheduled_time: scheduleData.scheduledTime,
            timezone: scheduleData.timezone,
            platform: scheduleData.platform,
          })
          .select()
          .single();

        if (scheduleError) throw scheduleError;

        // Update content status
        const { error: contentError } = await supabase
          .from('content_items')
          .update({ status: 'scheduled' })
          .eq('id', scheduleData.contentId);

        if (contentError) throw contentError;

        return new Response(
          JSON.stringify(schedule),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'GET': {
        const { startDate, endDate } = Object.fromEntries(
          new URL(req.url).searchParams.entries()
        );

        let query = supabase
          .from('content_schedules')
          .select(`
            *,
            content_items (
              id,
              title,
              type,
              status
            )
          `);

        if (startDate) {
          query = query.gte('scheduled_time', startDate);
        }
        if (endDate) {
          query = query.lte('scheduled_time', endDate);
        }

        const { data, error } = await query;
        if (error) throw error;

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'DELETE': {
        const { scheduleId } = await req.json();

        const { error } = await supabase
          .from('content_schedules')
          .delete()
          .eq('id', scheduleId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response('Method not allowed', { status: 405 });
    }
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