import mongoose from 'mongoose';

const AdminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: Map,
    of: String,
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AdminLog || mongoose.model('AdminLog', AdminLogSchema);