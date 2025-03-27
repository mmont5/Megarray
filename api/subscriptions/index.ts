import { NextApiRequest, NextApiResponse } from 'next';
import { createSubscription, cancelSubscription } from '../services/stripe';
import dbConnect from '../db/connect';
import Subscription from '../models/Subscription';
import User from '../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { userId, plan, priceId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create Stripe subscription
      const subscription = await createSubscription(user.stripeCustomerId, priceId);

      // Create subscription record
      const newSubscription = await Subscription.create({
        userId,
        plan,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        stripeCustomerId: user.stripeCustomerId,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });

      return res.status(200).json(newSubscription);
    } catch (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({ error: 'Subscription creation failed' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { subscriptionId } = req.query;

      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      // Cancel Stripe subscription
      await cancelSubscription(subscription.stripeSubscriptionId);

      subscription.status = 'canceled';
      subscription.cancelAtPeriodEnd = true;
      await subscription.save();

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return res.status(500).json({ error: 'Subscription cancellation failed' });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      const subscription = await Subscription.findOne({ userId });
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      return res.status(200).json(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}