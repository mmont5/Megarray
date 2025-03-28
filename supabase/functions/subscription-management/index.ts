import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import Stripe from 'npm:stripe@14.18.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
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
        const { planId } = await req.json();

        // Get plan details
        const { data: plan } = await supabase
          .from('plans')
          .select('*')
          .eq('id', planId)
          .single();

        if (!plan) throw new Error('Plan not found');

        // Get or create Stripe customer
        let { data: profile } = await supabase
          .from('profiles')
          .select('stripe_customer_id')
          .eq('id', user.id)
          .single();

        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            metadata: { user_id: user.id },
          });
          customerId = customer.id;

          await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
        }

        // Create subscription
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: plan.stripe_price_id }],
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          expand: ['latest_invoice.payment_intent'],
          metadata: { user_id: user.id },
        });

        return new Response(
          JSON.stringify({
            subscriptionId: subscription.id,
            clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'DELETE': {
        const { subscriptionId } = await req.json();

        // Verify ownership
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('stripe_subscription_id')
          .eq('id', subscriptionId)
          .eq('user_id', user.id)
          .single();

        if (!subscription) throw new Error('Subscription not found');

        // Cancel subscription
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id);

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