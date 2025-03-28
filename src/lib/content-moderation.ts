import { supabase } from './supabase';

export interface ContentModerationResult {
  status: 'passed' | 'failed';
  violations?: {
    ruleId: string;
    severity: string;
    action: string;
    details: {
      category: string;
      matches: string[];
    };
  }[];
}

export async function moderateContent(content: string, contentId: string): Promise<ContentModerationResult> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/content-moderation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        contentId,
        userId: user.id,
      }),
    });

    if (!response.ok) {
      throw new Error('Content moderation failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Content moderation error:', error);
    throw error;
  }
}

export async function submitAppeal(violationId: string, reason: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('content_appeals')
      .insert({
        violation_id: violationId,
        user_id: user.id,
        reason,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Appeal submission error:', error);
    throw error;
  }
}

export async function getContentViolations(contentId: string) {
  try {
    const { data, error } = await supabase
      .from('content_violations')
      .select(`
        *,
        content_moderation_rules (
          name,
          category,
          severity
        )
      `)
      .eq('content_id', contentId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching violations:', error);
    throw error;
  }
}

export async function getAppealStatus(violationId: string) {
  try {
    const { data, error } = await supabase
      .from('content_appeals')
      .select('*')
      .eq('violation_id', violationId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching appeal status:', error);
    throw error;
  }
}