import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../db/connect';
import AffiliateLink from '../models/AffiliateLink';
import AffiliateClick from '../models/AffiliateClick';
import AffiliateConversion from '../models/AffiliateConversion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const links = await AffiliateLink.find({ userId: req.query.userId });

      // Get stats for each link
      const linksWithStats = await Promise.all(links.map(async (link) => {
        const clicks = await AffiliateClick.countDocuments({ linkId: link._id });
        const conversions = await AffiliateConversion.find({ linkId: link._id });
        const earnings = conversions.reduce((sum, conv) => sum + conv.commissionAmount, 0);

        return {
          id: link._id,
          code: link.code,
          description: link.description,
          commission_rate: link.commissionRate,
          created_at: link.createdAt,
          stats: {
            clicks,
            conversions: conversions.length,
            earnings,
          },
        };
      }));

      return res.status(200).json(linksWithStats);
    } catch (error) {
      console.error('Error fetching affiliate links:', error);
      return res.status(500).json({ error: 'Failed to fetch affiliate links' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { description, commission_rate } = req.body;
      const code = generateUniqueCode();

      const link = await AffiliateLink.create({
        userId: req.body.userId,
        code,
        description,
        commissionRate: commission_rate,
      });

      return res.status(201).json(link);
    } catch (error) {
      console.error('Error creating affiliate link:', error);
      return res.status(500).json({ error: 'Failed to create affiliate link' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function generateUniqueCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 8;
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}