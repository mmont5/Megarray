import { NextApiRequest, NextApiResponse } from 'next';
import { createPaymentIntent, createStripeCustomer, handleWebhook } from '../services/stripe';
import dbConnect from '../db/connect';
import Payment from '../models/Payment';
import User from '../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { amount, currency, userId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create or retrieve Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await createStripeCustomer(user.email);
        stripeCustomerId = customer.id;
        user.stripeCustomerId = stripeCustomerId;
        await user.save();
      }

      // Create payment intent
      const paymentIntent = await createPaymentIntent(amount, currency, stripeCustomerId);

      // Create payment record
      const payment = await Payment.create({
        userId,
        type: 'stripe',
        amount,
        currency,
        stripePaymentId: paymentIntent.id,
      });

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      return res.status(500).json({ error: 'Payment processing failed' });
    }
  } else if (req.method === 'POST' && req.url?.endsWith('/webhook')) {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const event = await handleWebhook(signature, req.body);
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(400).json({ error: 'Webhook processing failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}