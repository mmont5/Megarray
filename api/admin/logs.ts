import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../db/connect';
import AdminLog from '../models/AdminLog';
import { adminAuth, checkPermission } from '../middleware/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = 1, limit = 50, type } = req.query;
    
    const query = type ? { action: { $regex: type, $options: 'i' } } : {};

    const logs = await AdminLog.find(query)
      .populate('adminId', 'email role')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ timestamp: -1 });

    const total = await AdminLog.countDocuments(query);

    return res.status(200).json({
      logs,
      total,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    return res.status(500).json({ error: 'Failed to fetch logs' });
  }
}