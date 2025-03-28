import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export async function createSubscription(priceId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-subscription`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId: user.id,
      }),
    });

    const { clientSecret, subscriptionId } = await response.json();

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const { error } = await stripe.confirmCardPayment(clientSecret);
    if (error) throw error;

    return { subscriptionId };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) throw new Error('Failed to cancel subscription');
    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-subscription`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId, priceId }),
    });

    if (!response.ok) throw new Error('Failed to update subscription');
    return await response.json();
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

export async function getSubscriptionStatus() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, subscription_items(*)')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
}

export async function getUsage() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('subscription_usage')
      .select('*')
      .eq('subscription_id', (
        await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .single()
      ).data?.id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting usage:', error);
    throw error;
  }
}