import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  currentPeriodEnd: string;
}

interface Usage {
  type: string;
  total: number;
  limit: number;
}

const SubscriptionManager = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const [subResponse, usageResponse] = await Promise.all([
        fetch('/api/subscriptions'),
        fetch('/api/usage'),
      ]);

      const subData = await subResponse.json();
      const usageData = await usageResponse.json();

      setSubscription(subData);
      setUsage(usageData);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch(`/api/subscriptions/${subscription?.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');

      toast.success('Subscription cancelled successfully');
      fetchSubscriptionData();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E5BE]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="p-6 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <p className="text-sm text-gray-600">{subscription?.plan || 'Free'}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            subscription?.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {subscription?.status || 'inactive'}
          </span>
        </div>

        {subscription && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
            <button
              onClick={handleCancelSubscription}
              className="mt-4 px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {/* Usage Stats */}
      <div className="p-6 bg-white rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage</h3>
        <div className="space-y-4">
          {usage.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{item.type}</span>
                <span>{item.total} / {item.limit === -1 ? '∞' : item.limit}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00E5BE] rounded-full"
                  style={{
                    width: item.limit === -1
                      ? '0%'
                      : `${Math.min((item.total / item.limit) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-6 bg-white rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">•••• 4242</p>
                <p className="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Default
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;