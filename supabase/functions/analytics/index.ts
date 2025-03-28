import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MetricSchema = z.object({
  contentId: z.string().uuid(),
  type: z.string(),
  value: z.number(),
  platform: z.string(),
  metadata: z.record(z.any()).optional(),
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
        const metricData = MetricSchema.parse(await req.json());

        // Get content details
        const { data: content } = await supabase
          .from('content_items')
          .select('agency_id')
          .eq('id', metricData.contentId)
          .single();

        if (!content) throw new Error('Content not found');

        // Record metric
        const { data, error } = await supabase
          .from('content_analytics')
          .insert({
            content_id: metricData.contentId,
            metric_type: metricData.type,
            value: metricData.value,
            platform: metricData.platform,
            agency_id: content.agency_id,
            metadata: metricData.metadata,
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'GET': {
        const { 
          contentId,
          startDate,
          endDate,
          platform,
          metrics = ['all'],
        } = Object.fromEntries(new URL(req.url).searchParams.entries());

        let query = supabase
          .from('content_analytics')
          .select(`
            *,
            content_items (
              title,
              type,
              platform
            )
          `);

        if (contentId) {
          query = query.eq('content_id', contentId);
        }
        if (startDate) {
          query = query.gte('recorded_at', startDate);
        }
        if (endDate) {
          query = query.lte('recorded_at', endDate);
        }
        if (platform) {
          query = query.eq('platform', platform);
        }
        if (!metrics.includes('all')) {
          query = query.in('metric_type', metrics);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Process and aggregate metrics
        const aggregatedData = processAnalytics(data);

        return new Response(
          JSON.stringify(aggregatedData),
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

function processAnalytics(data: any[]) {
  // Group metrics by type and calculate aggregates
  const metrics = data.reduce((acc, record) => {
    const key = `${record.platform}_${record.metric_type}`;
    if (!acc[key]) {
      acc[key] = {
        platform: record.platform,
        type: record.metric_type,
        total: 0,
        average: 0,
        count: 0,
        trend: [],
      };
    }
    acc[key].total += record.value;
    acc[key].count += 1;
    acc[key].average = acc[key].total / acc[key].count;
    acc[key].trend.push({
      date: record.recorded_at,
      value: record.value,
    });
    return acc;
  }, {});

  // Calculate trends and growth
  Object.values(metrics).forEach((metric: any) => {
    metric.trend.sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    if (metric.trend.length >= 2) {
      const first = metric.trend[0].value;
      const last = metric.trend[metric.trend.length - 1].value;
      metric.growth = ((last - first) / first) * 100;
    }
  });

  return {
    metrics: Object.values(metrics),
    summary: {
      totalEngagement: metrics.engagement?.total || 0,
      averageReach: metrics.reach?.average || 0,
      conversionRate: (metrics.conversions?.total / metrics.impressions?.total) * 100 || 0,
    },
  };
}