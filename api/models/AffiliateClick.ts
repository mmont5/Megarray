import mongoose from 'mongoose';

const AffiliateClickSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AffiliateLink',
    required: true,
  },
  ipAddress: String,
  userAgent: String,
  referrer: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AffiliateClick || mongoose.model('AffiliateClick', AffiliateClickSchema);