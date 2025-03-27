import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    required: true,
  },
  permissions: [{
    type: String,
    enum: [
      'manage_users',
      'manage_content',
      'manage_billing',
      'manage_settings',
      'view_analytics',
      'manage_admins'
    ],
  }],
  lastLogin: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);