import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../db/connect';
import AffiliatePayout from '../models/AffiliatePayout';
import User from '../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const payouts = await AffiliatePayout.find()
        .sort({ createdAt: -1 })
        .populate('userId', 'name email');

      const formattedPayouts = payouts.map(payout => ({
        id: payout._id,
        userId: payout.userId._id,
        userName: payout.userId.name,
        amount: payout.amount,
        method: payout.payoutMethod,
        status: payout.status,
        requestedAt: payout.createdAt,
      }));

      return res.status(200).json(formattedPayouts);
    } catch (error) {
      console.error('Error fetching payout requests:', error);
      return res.status(500).json({ error: 'Failed to fetch payout requests' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { payoutId } = req.query;
      const { action } = req.body;

      const payout = await AffiliatePayout.findById(payoutId);
      if (!payout) {
        return res.status(404).json({ error: 'Payout request not found' });
      }

      payout.status = action === 'approve' ? 'completed' : 'failed';
      if (action === 'approve') {
        payout.processedAt = new Date();
      }

      await payout.save();

      return res.status(200).json(payout);
    } catch (error) {
      console.error('Error updating payout status:', error);
      return res.status(500).json({ error: 'Failed to update payout status' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}