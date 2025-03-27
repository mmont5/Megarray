import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../db/connect';
import User from '../models/User';
import Payment from '../models/Payment';
import Usage from '../models/Usage';
import { adminAuth, checkPermission } from '../middleware/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [
      totalUsers,
      activeUsers,
      totalRevenue,
      totalUsage,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Usage.aggregate([
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),
    ]);

    return res.status(200).json({
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      revenue: totalRevenue[0]?.total || 0,
      usage: totalUsage.reduce((acc, curr) => {
        acc[curr._id] = curr.total;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}