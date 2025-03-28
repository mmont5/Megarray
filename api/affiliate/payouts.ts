import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../db/connect';
import AffiliatePayout from '../models/AffiliatePayout';
import AffiliateConversion from '../models/AffiliateConversion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const payouts = await AffiliatePayout.find({ userId: req.query.userId })
        .sort({ createdAt: -1 });

      return res.status(200).json(payouts);
    } catch (error) {
      console.error('Error fetching payouts:', error);
      return res.status(500).json({ error: 'Failed to fetch payouts' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { userId, payout_method, payout_details } = req.body;

      // Calculate available earnings
      const conversions = await AffiliateConversion.find({
        linkId: { $in: await getAffiliateLinks(userId) },
        status: 'completed',
      });

      const totalEarnings = conversions.reduce((sum, conv) => sum + conv.commissionAmount, 0);
      const existingPayouts = await AffiliatePayout.find({ userId });
      const paidAmount = existingPayouts.reduce((sum, payout) => sum + payout.amount, 0);
      const availableAmount = totalEarnings - paidAmount;

      if (availableAmount < 50) {
        return res.status(400).json({ error: 'Minimum payout amount is $50' });
      }

      const payout = await AffiliatePayout.create({
        userId,
        amount: availableAmount,
        payoutMethod: payout_method,
        payoutDetails: payout_details,
      });

      return res.status(201).json(payout);
    } catch (error) {
      console.error('Error creating payout request:', error);
      return res.status(500).json({ error: 'Failed to create payout request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function getAffiliateLinks(userId: string) {
  const links = await AffiliateLink.find({ userId });
  return links.map(link => link._id);
}