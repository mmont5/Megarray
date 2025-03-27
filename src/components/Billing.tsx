import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Shield, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: {
    credits: number;
    users: number;
  };
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'crypto' | 'apple_pay' | 'google_pay';
  details: {
    last4?: string;
    brand?: string;
    wallet?: string;
    address?: string;
  };
  isDefault: boolean;
}

const Billing = () => {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'AI content generation',
        'Basic analytics',
        'Single user',
        'Standard support',
      ],
      limits: {
        credits: 100,
        users: 1,
      },
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 49,
      features: [
        'AI content generation',
        'Advanced analytics',
        'Up to 3 team members',
        'Priority support',
        'Custom templates',
      ],
      limits: {
        credits: 1000,
        users: 3,
      },
    },
    {
      id: 'business',
      name: 'Business',
      price: 99,
      features: [
        'AI content generation',
        'Enterprise analytics',
        'Unlimited team members',
        '24/7 priority support',
        'Custom templates',
        'API access',
      ],
      limits: {
        credits: -1,
        users: -1,
      },
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 0,
      features: [
        'Custom AI models',
        'Dedicated support',
        'Custom integrations',
        'SLA',
        'Training & onboarding',
      ],
      limits: {
        credits: -1,
        users: -1,
      },
    },
  ];

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    try {
      // TODO: Implement upgrade logic with Stripe
      toast.success('Plan upgraded successfully!');
    } catch (error) {
      toast.error('Failed to upgrade plan');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (type: PaymentMethod['type']) => {
    setLoading(true);
    try {
      // TODO: Implement payment method addition
      toast.success('Payment method added successfully!');
      setShowAddPayment(false);
    } catch (error) {
      toast.error('Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePaymentMethod = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Implement payment method removal
      toast.success('Payment method removed successfully!');
    } catch (error) {
      toast.error('Failed to remove payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-gray-900">Billing & Plans</h3>
        </div>
      </div>

      {/* Current Plan */}
      <div className="p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Current Plan</h4>
            <p className="text-sm text-gray-600">Free Plan</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
              Active
            </span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Credits Used</p>
            <div className="mt-1 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-[#00E5BE] rounded-full" style={{ width: '45%' }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">45/100 credits</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Users</p>
            <div className="mt-1 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-[#00E5BE] rounded-full" style={{ width: '100%' }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">1/1 users</p>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 rounded-xl border-2 border-gray-100 hover:border-[#00E5BE] transition-all duration-300"
          >
            <h4 className="font-medium text-gray-900">{plan.name}</h4>
            {plan.price > 0 ? (
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
            ) : (
              <div className="mt-2">
                <span className="text-3xl font-bold">
                  {plan.id === 'free' ? 'Free' : 'Custom'}
                </span>
              </div>
            )}
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-[#00E5BE] mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading}
              className="mt-6 w-full px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] disabled:opacity-50"
            >
              {plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-medium text-gray-900">Payment Methods</h4>
          <button
            onClick={() => setShowAddPayment(true)}
            className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
          >
            Add Payment Method
          </button>
        </div>

        {showAddPayment && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-gray-900">Add Payment Method</h5>
              <button
                onClick={() => setShowAddPayment(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAddPaymentMethod('card')}
                className="p-4 border border-gray-200 rounded-lg hover:border-[#00E5BE]"
              >
                <CreditCard className="w-6 h-6 mb-2" />
                <span className="block font-medium">Credit Card</span>
              </button>
              <button
                onClick={() => handleAddPaymentMethod('crypto')}
                className="p-4 border border-gray-200 rounded-lg hover:border-[#00E5BE]"
              >
                <Wallet className="w-6 h-6 mb-2" />
                <span className="block font-medium">Crypto Wallet</span>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                {method.type === 'card' && <CreditCard className="w-5 h-5" />}
                {method.type === 'crypto' && <Wallet className="w-5 h-5" />}
                <div>
                  {method.type === 'card' && (
                    <p className="font-medium">
                      {method.details.brand} •••• {method.details.last4}
                    </p>
                  )}
                  {method.type === 'crypto' && (
                    <p className="font-medium">
                      {method.details.wallet?.slice(0, 6)}...
                      {method.details.wallet?.slice(-4)}
                    </p>
                  )}
                  {method.isDefault && (
                    <span className="text-sm text-gray-500">Default</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemovePaymentMethod(method.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Note */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h5 className="font-medium text-blue-900">Payment Security</h5>
            <p className="mt-1 text-sm text-blue-700">
              All payment information is encrypted and securely stored. We use industry-standard security measures to protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;