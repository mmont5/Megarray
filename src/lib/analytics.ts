import { supabase } from './supabase';

export interface AnalyticsMetric {
  id: string;
  content_id: string;
  metric_type: string;
  value: number;
  recorded_at: string;
  platform: string;
  agency_id: string;
}

export async function trackMetric(
  contentId: string,
  metricType: string,
  value: number,
  platform: string
) {
  try {
    const { data: content } = await supabase
      .from('content_items')
      .select('agency_id')
      .eq('id', contentId)
      .single();

    if (!content) throw new Error('Content not found');

    const { error } = await supabase
      .from('content_analytics')
      .insert({
        content_id: contentId,
        metric_type: metricType,
        value,
        platform,
        agency_id: content.agency_id,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking metric:', error);
    throw error;
  }
}

export async function getContentAnalytics(
  contentId: string,
  startDate?: string,
  endDate?: string
) {
  try {
    let query = supabase
      .from('content_analytics')
      .select('*')
      .eq('content_id', contentId)
      .order('recorded_at', { ascending: false });

    if (startDate) {
      query = query.gte('recorded_at', startDate);
    }
    if (endDate) {
      query = query.lte('recorded_at', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching content analytics:', error);
    throw error;
  }
}

export async function getAgencyAnalytics(
  agencyId: string,
  platform?: string,
  startDate?: string,
  endDate?: string
) {
  try {
    let query = supabase
      .from('content_analytics')
      .select(`
        *,
        content_items (
          title,
          type,
          platform
        )
      `)
      .eq('agency_id', agencyId)
      .order('recorded_at', { ascending: false });

    if (platform) {
      query = query.eq('platform', platform);
    }
    if (startDate) {
      query = query.gte('recorded_at', startDate);
    }
    if (endDate) {
      query = query.lte('recorded_at', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching agency analytics:', error);
    throw error;
  }
}

export async function getAnalyticsSummary(agencyId: string) {
  try {
    const { data, error } = await supabase
      .from('content_analytics')
      .select(`
        platform,
        metric_type,
        value
      `)
      .eq('agency_id', agencyId)
      .gte('recorded_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    // Aggregate metrics by platform and type
    const summary = data.reduce((acc: any, metric) => {
      const key = `${metric.platform}_${metric.metric_type}`;
      if (!acc[key]) {
        acc[key] = {
          platform: metric.platform,
          metric_type: metric.metric_type,
          total: 0,
          count: 0,
        };
      }
      acc[key].total += metric.value;
      acc[key].count += 1;
      return acc;
    }, {});

    // Calculate averages
    return Object.values(summary).map((metric: any) => ({
      ...metric,
      average: metric.total / metric.count,
    }));
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    throw error;
  }
}