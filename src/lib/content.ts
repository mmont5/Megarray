import { supabase } from './supabase';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  platform?: string;
  language: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ContentTag {
  id: string;
  name: string;
  color: string;
}

export async function createContent(data: Partial<ContentItem>) {
  try {
    const { data: content, error } = await supabase
      .from('content_items')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return content;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
}

export async function updateContent(id: string, data: Partial<ContentItem>) {
  try {
    const { data: content, error } = await supabase
      .from('content_items')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return content;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
}

export async function deleteContent(id: string) {
  try {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}

export async function getContent(id: string) {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select(`
        *,
        creator:profiles(*),
        tags:content_item_tags(
          tag:content_tags(*)
        ),
        approval_flow:content_approval_flows(*),
        distribution:content_distribution(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}

export async function listContent(filters: {
  status?: string;
  type?: string;
  platform?: string;
  language?: string;
  tags?: string[];
}) {
  try {
    let query = supabase
      .from('content_items')
      .select(`
        *,
        creator:profiles(*),
        tags:content_item_tags(
          tag:content_tags(*)
        ),
        approval_flow:content_approval_flows(*),
        distribution:content_distribution(*)
      `);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.platform) {
      query = query.eq('platform', filters.platform);
    }
    if (filters.language) {
      query = query.eq('language', filters.language);
    }
    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing content:', error);
    throw error;
  }
}

export async function createTag(name: string, color: string) {
  try {
    const { data: tag, error } = await supabase
      .from('content_tags')
      .insert({ name, color })
      .select()
      .single();

    if (error) throw error;
    return tag;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
}

export async function addTagToContent(contentId: string, tagId: string) {
  try {
    const { error } = await supabase
      .from('content_item_tags')
      .insert({ content_id: contentId, tag_id: tagId });

    if (error) throw error;
  } catch (error) {
    console.error('Error adding tag to content:', error);
    throw error;
  }
}

export async function removeTagFromContent(contentId: string, tagId: string) {
  try {
    const { error } = await supabase
      .from('content_item_tags')
      .delete()
      .eq('content_id', contentId)
      .eq('tag_id', tagId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing tag from content:', error);
    throw error;
  }
}

export async function scheduleContent(contentId: string, scheduledTime: string, platform: string) {
  try {
    const { error } = await supabase
      .from('content_distribution')
      .insert({
        content_id: contentId,
        platform,
        status: 'scheduled',
        scheduled_time: scheduledTime,
      });

    if (error) throw error;

    // Update content status
    await updateContent(contentId, { status: 'scheduled' });
  } catch (error) {
    console.error('Error scheduling content:', error);
    throw error;
  }
}

export async function getContentMetrics(contentId: string) {
  try {
    const { data, error } = await supabase
      .from('content_distribution')
      .select('metrics')
      .eq('content_id', contentId)
      .single();

    if (error) throw error;
    return data.metrics;
  } catch (error) {
    console.error('Error fetching content metrics:', error);
    throw error;
  }
}

export async function approveContent(contentId: string, feedback?: string) {
  try {
    const { error } = await supabase
      .from('content_approval_flows')
      .update({
        status: 'approved',
        feedback: feedback ? [feedback] : [],
        updated_at: new Date().toISOString(),
      })
      .eq('content_id', contentId);

    if (error) throw error;

    // Update content status
    await updateContent(contentId, { status: 'approved' });
  } catch (error) {
    console.error('Error approving content:', error);
    throw error;
  }
}

export async function rejectContent(contentId: string, feedback: string) {
  try {
    const { error } = await supabase
      .from('content_approval_flows')
      .update({
        status: 'rejected',
        feedback: [feedback],
        updated_at: new Date().toISOString(),
      })
      .eq('content_id', contentId);

    if (error) throw error;

    // Update content status
    await updateContent(contentId, { status: 'rejected' });
  } catch (error) {
    console.error('Error rejecting content:', error);
    throw error;
  }
}