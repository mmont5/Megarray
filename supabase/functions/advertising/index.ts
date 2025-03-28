import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CampaignSchema = z.object({
  name: z.string(),
  platform: z.string(),
  objective: z.string(),
  budget: z.object({
    amount: z.number().positive(),
    currency: z.string(),
    duration: z.number().int().positive(),
  }),
  targeting: z.object({
    locations: z.array(z.string()),
    interests: z.array(z.string()),
    demographics: z.object({
      ageRange: z.string(),
      gender: z.string(),
    }),
  }),
  content: z.object({
    headline: z.string(),
    description: z.string(),
    media: z.array(z.string()).optional(),
    callToAction: z.string(),
  }),
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
        const campaignData = CampaignSchema.parse(await req.json());

        // Create campaign
        const { data: campaign, error: campaignError } = await supabase
          .from('ad_campaigns')
          .insert({
            ...campaignData,
            creator_id: user.id,
            status: 'draft',
          })
          .select()
          .single();

        if (campaignError) throw campaignError;

        // Create ad sets and ads
        const { data: adSet, error: adSetError } = await supabase
          .from('ad_sets')
          .insert({
            campaign_id: campaign.id,
            name: `${campaign.name} - Main`,
            targeting: campaignData.targeting,
            budget: campaignData.budget,
          })
          .select()
          .single();

        if (adSetError) throw adSetError;

        const { error: adError } = await supabase
          .from('ads')
          .insert({
            ad_set_id: adSet.id,
            content: campaignData.content,
            status: 'draft',
          });

        if (adError) throw adError;

        return new Response(
          JSON.stringify(campaign),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'GET': {
        const { campaignId } = Object.fromEntries(
          new URL(req.url).searchParams.entries()
        );

        if (campaignId) {
          // Get specific campaign with performance data
          const { data: campaign, error: campaignError } = await supabase
            .from('ad_campaigns')
            .select(`
              *,
              ad_sets (
                *,
                ads (
                  *,
                  performance:ad_performance(*)
                )
              )
            `)
            .eq('id', campaignId)
            .single();

          if (campaignError) throw campaignError;

          return new Response(
            JSON.stringify(campaign),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // List all campaigns
          const { data: campaigns, error: campaignsError } = await supabase
            .from('ad_campaigns')
            .select(`
              *,
              ad_sets (
                id,
                name,
                status
              )
            `)
            .eq('creator_id', user.id);

          if (campaignsError) throw campaignsError;

          return new Response(
            JSON.stringify(campaigns),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      case 'PUT': {
        const { campaignId, action, data } = await req.json();

        switch (action) {
          case 'launch': {
            // Verify campaign is ready
            const { data: campaign } = await supabase
              .from('ad_campaigns')
              .select('*')
              .eq('id', campaignId)
              .single();

            if (!campaign) throw new Error('Campaign not found');

            // Launch campaign on ad platform
            // This would integrate with Meta, Google, etc. APIs
            const platformResponse = await launchCampaign(campaign);

            // Update campaign status
            const { data: updatedCampaign, error } = await supabase
              .from('ad_campaigns')
              .update({
                status: 'active',
                platform_campaign_id: platformResponse.id,
                launched_at: new Date().toISOString(),
              })
              .eq('id', campaignId)
              .select()
              .single();

            if (error) throw error;

            return new Response(
              JSON.stringify(updatedCampaign),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          case 'pause':
          case 'resume':
          case 'stop': {
            const { data: campaign, error } = await supabase
              .from('ad_campaigns')
              .update({
                status: action === 'pause' ? 'paused' : 
                        action === 'resume' ? 'active' : 'stopped',
              })
              .eq('id', campaignId)
              .select()
              .single();

            if (error) throw error;

            return new Response(
              JSON.stringify(campaign),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          default:
            throw new Error('Unknown action');
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

// Placeholder function - implement actual platform integrations
async function launchCampaign(campaign: any) {
  // This would integrate with various ad platform APIs
  return { id: `platform_${Date.now()}` };
}