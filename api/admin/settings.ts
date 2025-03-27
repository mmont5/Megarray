import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../db/connect';
import { adminAuth, checkPermission } from '../middleware/adminAuth';

// In production, use a proper settings model
const settings = {
  maintenance_mode: false,
  user_registration: true,
  max_file_size: 10485760, // 10MB
  allowed_file_types: ['image/jpeg', 'image/png', 'image/gif'],
  api_rate_limit: 100,
  email_notifications: true,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    return res.status(200).json(settings);
  }

  if (req.method === 'PUT') {
    try {
      const updates = req.body;
      Object.assign(settings, updates);
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Error updating settings:', error);
      return res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}