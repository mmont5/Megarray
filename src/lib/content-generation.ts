import { supabase } from './supabase';

export interface GenerationOptions {
  type: string;
  topic: string;
  keywords: string[];
  hashtags: string[];
  language?: string;
  humanize?: boolean;
}

export interface GenerationResult {
  content: string;
  metadata: {
    type: string;
    topic: string;
    keywords: string[];
    hashtags: string[];
    language: string;
    humanized: boolean;
  };
}

export async function generateContent(options: GenerationOptions): Promise<GenerationResult> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...options,
        language: options.language || 'en',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate content');
    }

    const data = await response.json();
    return {
      content: data.content,
      metadata: {
        type: options.type,
        topic: options.topic,
        keywords: options.keywords,
        hashtags: options.hashtags,
        language: options.language || 'en',
        humanized: options.humanize || false,
      },
    };
  } catch (error) {
    console.error('Content generation error:', error);
    throw error;
  }
}

export async function getGenerationHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('content_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching generation history:', error);
    throw error;
  }
}

export async function getUsageStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('usage')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'ai_generation')
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    return {
      total: data.reduce((sum, record) => sum + record.amount, 0),
      records: data,
    };
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    throw error;
  }
}