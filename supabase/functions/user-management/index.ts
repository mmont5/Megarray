import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UpdateUserSchema = z.object({
  userId: z.string().uuid(),
  data: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
    preferences: z.record(z.any()).optional(),
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
      case 'GET': {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            subscriptions (
              id,
              status,
              current_period_end,
              plans (
                name,
                features,
                limits
              )
            )
          `)
          .eq('id', user.id)
          .single();

        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'PUT': {
        const { userId, data: updateData } = UpdateUserSchema.parse(await req.json());

        // Check permissions
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const canUpdateUser = profile?.role === 'admin' || user.id === userId;
        if (!canUpdateUser) throw new Error('Unauthorized');

        const { data, error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
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