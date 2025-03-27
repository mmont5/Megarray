import Usage from '../models/Usage';
import User from '../models/User';
import Subscription from '../models/Subscription';

export const trackUsage = async (
  userId: string,
  type: string,
  amount: number,
  metadata?: Record<string, string>
) => {
  try {
    const usage = new Usage({
      userId,
      type,
      amount,
      metadata,
    });

    await usage.save();

    // Check usage limits
    const user = await User.findById(userId).populate('subscription');
    if (!user) {
      throw new Error('User not found');
    }

    const subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Get total usage for the current period
    const totalUsage = await Usage.aggregate([
      {
        $match: {
          userId,
          type,
          timestamp: {
            $gte: subscription.currentPeriodStart,
            $lte: subscription.currentPeriodEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const usageLimit = getPlanLimit(subscription.plan, type);
    if (usageLimit !== -1 && totalUsage[0]?.total > usageLimit) {
      throw new Error('Usage limit exceeded');
    }

    return usage;
  } catch (error) {
    console.error('Error tracking usage:', error);
    throw error;
  }
};

export const getUsageStats = async (userId: string) => {
  try {
    const stats = await Usage.aggregate([
      {
        $match: { userId },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    return stats;
  } catch (error) {
    console.error('Error getting usage stats:', error);
    throw error;
  }
};

const getPlanLimit = (plan: string, type: string): number => {
  const limits: Record<string, Record<string, number>> = {
    free: {
      credits: 100,
      storage: 1024 * 1024 * 100, // 100MB
      api_calls: 1000,
    },
    pro: {
      credits: 1000,
      storage: 1024 * 1024 * 1000, // 1GB
      api_calls: 10000,
    },
    business: {
      credits: -1, // unlimited
      storage: 1024 * 1024 * 10000, // 10GB
      api_calls: -1, // unlimited
    },
    enterprise: {
      credits: -1,
      storage: -1,
      api_calls: -1,
    },
  };

  return limits[plan]?.[type] ?? -1;
};