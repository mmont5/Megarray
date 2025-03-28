import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import Stripe from 'npm:stripe@14.18.0';
import { ethers } from 'npm:ethers@6.11.1';

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
        const { method, amount, currency = 'USD', ...paymentDetails } = await req.json();

        switch (method) {
          case 'stripe': {
            // Create or get customer
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

            // Create payment intent
            const paymentIntent = await stripe.paymentIntents.create({
              amount: Math.round(amount * 100), // Convert to cents
              currency,
              customer: customerId,
              payment_method_types: ['card'],
              metadata: { user_id: user.id },
            });

            return new Response(
              JSON.stringify({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          case 'crypto': {
            const { walletAddress, network } = paymentDetails;

            // Validate wallet address
            if (!ethers.isAddress(walletAddress)) {
              throw new Error('Invalid wallet address');
            }

            // Create payment record
            const { data: payment, error } = await supabase
              .from('crypto_payments')
              .insert({
                user_id: user.id,
                amount,
                currency: currency.toUpperCase(),
                wallet_address: walletAddress,
                network,
                status: 'pending',
              })
              .select()
              .single();

            if (error) throw error;

            return new Response(
              JSON.stringify(payment),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          default:
            throw new Error('Unsupported payment method');
        }
      }

      case 'GET': {
        const { paymentId, method } = Object.fromEntries(
          new URL(req.url).searchParams.entries()
        );

        switch (method) {
          case 'stripe': {
            const payment = await stripe.paymentIntents.retrieve(paymentId);
            return new Response(
              JSON.stringify(payment),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          case 'crypto': {
            const { data: payment, error } = await supabase
              .from('crypto_payments')
              .select('*')
              .eq('id', paymentId)
              .eq('user_id', user.id)
              .single();

            if (error) throw error;

            return new Response(
              JSON.stringify(payment),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          default:
            throw new Error('Unsupported payment method');
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