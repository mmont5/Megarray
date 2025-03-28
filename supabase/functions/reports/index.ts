import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ReportSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  metrics: z.array(z.string()),
  platforms: z.array(z.string()),
  format: z.enum(['pdf', 'csv', 'json']).default('pdf'),
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
        const reportConfig = ReportSchema.parse(await req.json());

        // Get analytics data
        const { data: analytics } = await supabase
          .from('content_analytics')
          .select(`
            *,
            content_items (
              title,
              type,
              platform
            )
          `)
          .gte('recorded_at', reportConfig.startDate)
          .lte('recorded_at', reportConfig.endDate)
          .in('platform', reportConfig.platforms)
          .in('metric_type', reportConfig.metrics);

        // Process data
        const report = await generateReport(analytics, reportConfig);

        // Store report
        const { data: savedReport, error } = await supabase
          .from('reports')
          .insert({
            user_id: user.id,
            type: reportConfig.type,
            config: reportConfig,
            data: report,
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify(savedReport),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'GET': {
        const { reportId } = Object.fromEntries(
          new URL(req.url).searchParams.entries()
        );

        if (reportId) {
          // Get specific report
          const { data: report, error } = await supabase
            .from('reports')
            .select('*')
            .eq('id', reportId)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;

          return new Response(
            JSON.stringify(report),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // List reports
          const { data: reports, error } = await supabase
            .from('reports')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(
            JSON.stringify(reports),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
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

async function generateReport(data: any[], config: any) {
  // Process analytics data
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

  // Calculate insights
  const insights = [];
  
  // Growth trends
  Object.values(metrics).forEach((metric: any) => {
    if (metric.trend.length >= 2) {
      const first = metric.trend[0].value;
      const last = metric.trend[metric.trend.length - 1].value;
      const growth = ((last - first) / first) * 100;
      
      if (Math.abs(growth) > 10) {
        insights.push({
          type: 'trend',
          metric: metric.type,
          platform: metric.platform,
          change: growth,
          message: `${metric.type} on ${metric.platform} has ${growth > 0 ? 'increased' : 'decreased'} by ${Math.abs(growth).toFixed(1)}%`,
        });
      }
    }
  });

  // Platform comparison
  const platformMetrics = Object.values(metrics).reduce((acc: any, metric: any) => {
    if (!acc[metric.platform]) {
      acc[metric.platform] = {
        engagement: 0,
        reach: 0,
        conversions: 0,
      };
    }
    acc[metric.platform][metric.type] = metric.total;
    return acc;
  }, {});

  const bestPlatform = Object.entries(platformMetrics).reduce((best, [platform, metrics]: [string, any]) => {
    const score = metrics.engagement + metrics.reach + metrics.conversions;
    return score > best.score ? { platform, score } : best;
  }, { platform: '', score: -1 });

  insights.push({
    type: 'platform',
    platform: bestPlatform.platform,
    message: `${bestPlatform.platform} is your best performing platform`,
  });

  return {
    metrics: Object.values(metrics),
    insights,
    summary: {
      totalEngagement: Object.values(metrics).reduce((sum: number, m: any) => 
        m.type === 'engagement' ? sum + m.total : sum, 0),
      averageReach: Object.values(metrics).reduce((sum: number, m: any) => 
        m.type === 'reach' ? sum + m.average : sum, 0),
      bestPlatform: bestPlatform.platform,
    },
  };
}