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

    const { content, contentId, userId } = await req.json();

    // Here you would integrate with a content moderation API
    // For example: Azure Content Moderator, Amazon Rekognition, etc.
    // For now, we'll use a simple keyword check
    const moderationResult = await checkContent(content);

    if (moderationResult.violations.length > 0) {
      // Get user's subscription tier
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plans(name)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      const isEnterprise = subscription?.plans?.name === 'Enterprise';

      // Create violation records
      for (const violation of moderationResult.violations) {
        await supabase
          .from('content_violations')
          .insert({
            content_id: contentId,
            rule_id: violation.ruleId,
            user_id: userId,
            severity: violation.severity,
            details: violation.details,
            action_taken: isEnterprise ? 'suspend' : violation.action
          });
      }

      // Update content status
      await supabase
        .from('content_items')
        .update({ 
          status: isEnterprise ? 'suspended' : 'removed',
          moderation_status: 'failed',
          moderation_details: moderationResult
        })
        .eq('id', contentId);

      return new Response(
        JSON.stringify({
          status: 'failed',
          violations: moderationResult.violations
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Content passed moderation
    await supabase
      .from('content_items')
      .update({ 
        moderation_status: 'passed',
        moderation_details: moderationResult
      })
      .eq('id', contentId);

    return new Response(
      JSON.stringify({ status: 'passed' }),
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

// Simple content moderation function
// In production, replace with actual AI moderation service
function checkContent(content: string) {
  const violations = [];
  const rules = {
    hate: /\b(hate|hateful|discriminat(e|ion))\b/i,
    racism: /\b(racist|racial slur)\b/i,
    adult: /\b(nsfw|xxx|porn)\b/i,
    violence: /\b(gore|violent|graphic violence)\b/i,
    illegal: /\b(illegal|criminal|crime)\b/i
  };

  for (const [category, pattern] of Object.entries(rules)) {
    if (pattern.test(content)) {
      violations.push({
        ruleId: category,
        severity: 'high',
        action: category === 'illegal' ? 'ban' : 'suspend',
        details: {
          category,
          matches: content.match(pattern)
        }
      });
    }
  }

  return {
    violations,
    scanned_at: new Date().toISOString(),
    content_length: content.length
  };
}