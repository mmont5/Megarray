import { NextApiRequest, NextApiResponse } from 'next';
import { trackUsage, getUsageStats } from '../services/usage';
import dbConnect from '../db/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { userId, type, amount, metadata } = req.body;

      const usage = await trackUsage(userId, type, amount, metadata);
      return res.status(200).json(usage);
    } catch (error) {
      console.error('Error tracking usage:', error);
      return res.status(500).json({ error: 'Usage tracking failed' });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      const stats = await getUsageStats(userId as string);
      return res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      return res.status(500).json({ error: 'Failed to fetch usage stats' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}