import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../db/connect';
import User from '../models/User';
import { adminAuth, checkPermission } from '../middleware/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, search } = req.query;
      
      const query = search
        ? { email: { $regex: search, $options: 'i' } }
        : {};

      const users = await User.find(query)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      return res.status(200).json({
        users,
        total,
        pages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { userId } = req.query;
      const updates = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { userId } = req.query;

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}