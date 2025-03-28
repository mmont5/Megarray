import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TestSchema = z.object({
  name: z.string(),
  platform: z.string(),
  variations: z.array(z.object({
    content: z.string(),
    audience: z.string(),
  })),
  duration: z.number().int().positive(),
  metrics: z.array(z.string()),
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
        const testData = TestSchema.parse(await req.json());

        // Create A/B test
        const { data: test, error: testError } = await supabase
          .from('ab_tests')
          .insert({
            name: testData.name,
            platform: testData.platform,
            creator_id: user.id,
            duration: testData.duration,
            metrics: testData.metrics,
            status: 'running',
          })
          .select()
          .single();

        if (testError) throw testError;

        // Create variations
        const variations = await Promise.all(
          testData.variations.map(async (variation, index) => {
            const { data, error } = await supabase
              .from('ab_test_variations')
              .insert({
                test_id: test.id,
                content: variation.content,
                audience: variation.audience,
                variant: String.fromCharCode(65 + index), // A, B, C, etc.
              })
              .select()
              .single();

            if (error) throw error;
            return data;
          })
        );

        return new Response(
          JSON.stringify({ ...test, variations }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'GET': {
        const { testId } = Object.fromEntries(
          new URL(req.url).searchParams.entries()
        );

        const { data: test, error: testError } = await supabase
          .from('ab_tests')
          .select(`
            *,
            variations:ab_test_variations(*)
          `)
          .eq('id', testId)
          .single();

        if (testError) throw testError;

        // Calculate results if test is complete
        if (test.status === 'completed') {
          const { data: results } = await supabase
            .from('ab_test_results')
            .select('*')
            .eq('test_id', testId);

          return new Response(
            JSON.stringify({ ...test, results }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify(test),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'PUT': {
        const { testId, action } = await req.json();

        switch (action) {
          case 'stop': {
            const { data, error } = await supabase
              .from('ab_tests')
              .update({ status: 'completed', completed_at: new Date().toISOString() })
              .eq('id', testId)
              .select()
              .single();

            if (error) throw error;

            // Calculate and store results
            const results = await calculateTestResults(testId);

            return new Response(
              JSON.stringify({ ...data, results }),
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

async function calculateTestResults(testId: string) {
  // Implement statistical analysis for A/B test results
  // This is a placeholder - implement actual statistical calculations
  return {
    winner: 'A',
    confidence: 95,
    improvement: 23.4,
    metrics: {
      engagement: { A: 0.12, B: 0.15 },
      clicks: { A: 245, B: 312 },
      conversions: { A: 12, B: 18 },
    },
  };
}