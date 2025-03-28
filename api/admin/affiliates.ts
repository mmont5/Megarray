import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../db/connect';
import AffiliateLink from '../models/AffiliateLink';
import AffiliateClick from '../models/AffiliateClick';
import AffiliateConversion from '../models/AffiliateConversion';
import User from '../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const users = await User.find();
      
      const affiliateStats = await Promise.all(users.map(async (user) => {
        const links = await AffiliateLink.find({ userId: user._id });
        const linkIds = links.map(link => link._id);

        const clicks = await AffiliateClick.countDocuments({ linkId: { $in: linkIds } });
        const conversions = await AffiliateConversion.find({ linkId: { $in: linkIds } });
        
        const totalEarnings = conversions.reduce((sum, conv) => sum + conv.commissionAmount, 0);
        const pendingPayouts = conversions
          .filter(conv => conv.status === 'completed')
          .reduce((sum, conv) => sum + conv.commissionAmount, 0);

        const conversionRate = clicks > 0 ? (conversions.length / clicks) * 100 : 0;

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          totalEarnings,
          pendingPayout: pendingPayouts,
          conversionRate,
          status: 'active', // You might want to add a status field to your User model
          joinedAt: user.createdAt,
        };
      }));

      return res.status(200).json(affiliateStats);
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
      return res.status(500).json({ error: 'Failed to fetch affiliate stats' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}