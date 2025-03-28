import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CustomModelSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  baseModel: z.string(),
  parameters: z.record(z.any()),
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

    // Verify enterprise subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plans(name)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!subscription?.plans?.name === 'Enterprise') {
      throw new Error('Enterprise subscription required');
    }

    switch (req.method) {
      case 'POST': {
        const { feature } = await req.json();

        switch (feature) {
          case 'custom_model': {
            const modelData = CustomModelSchema.parse(await req.json());
            
            const { data, error } = await supabase
              .from('custom_models')
              .insert({
                ...modelData,
                user_id: user.id,
                status: 'training',
              })
              .select()
              .single();

            if (error) throw error;

            // Start model training (implement separately)
            await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/train-model`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ modelId: data.id }),
            });

            return new Response(
              JSON.stringify(data),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          case 'white_label': {
            const { domain, brandingData } = await req.json();

            const { data, error } = await supabase
              .from('white_label_config')
              .upsert({
                user_id: user.id,
                domain,
                branding: brandingData,
              })
              .select()
              .single();

            if (error) throw error;

            return new Response(
              JSON.stringify(data),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          case 'api_access': {
            const { data, error } = await supabase
              .from('api_keys')
              .insert({
                user_id: user.id,
                name: 'API Key',
                permissions: ['read', 'write'],
              })
              .select()
              .single();

            if (error) throw error;

            return new Response(
              JSON.stringify(data),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          default:
            throw new Error('Unknown enterprise feature');
        }
      }

      case 'GET': {
        const { feature } = new URL(req.url).searchParams;

        switch (feature) {
          case 'custom_models': {
            const { data, error } = await supabase
              .from('custom_models')
              .select('*')
              .eq('user_id', user.id);

            if (error) throw error;

            return new Response(
              JSON.stringify(data),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          case 'white_label': {
            const { data, error } = await supabase
              .from('white_label_config')
              .select('*')
              .eq('user_id', user.id)
              .single();

            if (error) throw error;

            return new Response(
              JSON.stringify(data),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          case 'api_keys': {
            const { data, error } = await supabase
              .from('api_keys')
              .select('*')
              .eq('user_id', user.id);

            if (error) throw error;

            return new Response(
              JSON.stringify(data),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          default:
            throw new Error('Unknown enterprise feature');
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