import mongoose from 'mongoose';

const AffiliateLinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  commissionRate: {
    type: Number,
    required: true,
    default: 0.1,
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

export default mongoose.models.AffiliateLink || mongoose.model('AffiliateLink', AffiliateLinkSchema);