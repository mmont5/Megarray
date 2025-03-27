import { NextApiRequest, NextApiResponse } from 'next';
import Admin from '../models/Admin';
import AdminLog from '../models/AdminLog';

export interface AuthenticatedRequest extends NextApiRequest {
  admin?: any;
}

export const adminAuth = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    // In production, verify JWT token and get adminId
    const adminId = req.headers['x-admin-id'];
    
    if (!adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    // Log admin action
    await AdminLog.create({
      adminId: admin._id,
      action: `${req.method} ${req.url}`,
      details: {
        body: JSON.stringify(req.body),
        query: JSON.stringify(req.query),
      },
      ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

export const checkPermission = (permission: string) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse, next: () => void) => {
    if (!req.admin.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
};