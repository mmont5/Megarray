import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['post', 'blog', 'caption', 'email', 'script', 'thread', 'ad', 'newsletter'],
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  keywords: [{
    type: String,
  }],
  content: {
    type: String,
    required: true,
  },
  isHumanized: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);