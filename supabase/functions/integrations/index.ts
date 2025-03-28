import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const IntegrationSchema = z.object({
  provider: z.string(),
  credentials: z.record(z.any()),
  settings: z.record(z.any()).optional(),
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
        const { provider, credentials, settings } = IntegrationSchema.parse(await req.json());

        // Verify and encrypt credentials
        const encryptedCredentials = await encryptCredentials(credentials);

        // Create or update integration
        const { data, error } = await supabase
          .from('integrations')
          .upsert({
            user_id: user.id,
            provider,
            credentials: encryptedCredentials,
            settings,
            status: 'active',
            last_sync: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        // Initialize integration
        await initializeIntegration(provider, credentials);

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'GET': {
        const { provider } = Object.fromEntries(
          new URL(req.url).searchParams.entries()
        );

        let query = supabase
          .from('integrations')
          .select('*')
          .eq('user_id', user.id);

        if (provider) {
          query = query.eq('provider', provider);
        }

        const { data, error } = await query;
        if (error) throw error;

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'DELETE': {
        const { integrationId } = await req.json();

        // Get integration details
        const { data: integration } = await supabase
          .from('integrations')
          .select('provider, credentials')
          .eq('id', integrationId)
          .eq('user_id', user.id)
          .single();

        if (!integration) throw new Error('Integration not found');

        // Disconnect from provider
        await disconnectIntegration(integration.provider, integration.credentials);

        // Delete integration
        const { error } = await supabase
          .from('integrations')
          .delete()
          .eq('id', integrationId);

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

// Placeholder functions - implement actual encryption and provider integrations
async function encryptCredentials(credentials: any) {
  // Implement proper encryption
  return credentials;
}

async function initializeIntegration(provider: string, credentials: any) {
  // Implement provider-specific initialization
  return true;
}

async function disconnectIntegration(provider: string, credentials: any) {
  // Implement provider-specific disconnection
  return true;
}