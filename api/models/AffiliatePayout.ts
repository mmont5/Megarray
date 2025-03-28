import mongoose from 'mongoose';

const AffiliatePayoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  payoutMethod: {
    type: String,
    required: true,
  },
  payoutDetails: {
    type: Map,
    of: String,
    default: {},
  },
  processedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AffiliatePayout || mongoose.model('AffiliatePayout', AffiliatePayoutSchema);