import React, { useState } from 'react';
import { DollarSign, RefreshCw, Settings, CreditCard, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';

const BillingSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    stripe: {
      enabled: true,
      mode: 'live',
      webhookSecret: '••••••••',
    },
    crypto: {
      enabled: true,
      networks: ['ethereum', 'polygon'],
      tokens: ['ETH', 'USDC', 'MATIC'],
    },
    plans: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['AI content generation', 'Basic analytics', 'Single user'],
        limits: { credits: 100, users: 1 },
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 49,
        features: ['AI content generation', 'Advanced analytics', 'Up to 3 team members'],
        limits: { credits: 1000, users: 3 },
      },
      {
        id: 'business',
        name: 'Business',
        price: 99,
        features: ['AI content generation', 'Enterprise analytics', 'Unlimited team members'],
        limits: { credits: -1, users: -1 },
      },
    ],
    affiliate: {
      enabled: true,
      commission: 20,
      minPayout: 50,
    },
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          category: 'billing',
          settings: settings,
        });

      if (error) throw error;
      toast.success('Billing settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to update billing settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-[#00E5BE]" />
          <h2 className="text-2xl font-bold text-white">Billing Settings</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Settings className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stripe Settings */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Stripe Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.stripe.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    stripe: { ...settings.stripe, enabled: e.target.checked }
                  })}
                  className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
                />
                <span className="ml-2 text-gray-300">Enable Stripe Payments</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Mode</label>
              <select
                value={settings.stripe.mode}
                onChange={(e) => setSettings({
                  ...settings,
                  stripe: { ...settings.stripe, mode: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              >
                <option value="test">Test Mode</option>
                <option value="live">Live Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Webhook Secret</label>
              <input
                type="password"
                value={settings.stripe.webhookSecret}
                onChange={(e) => setSettings({
                  ...settings,
                  stripe: { ...settings.stripe, webhookSecret: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
          </div>
        </div>

        {/* Crypto Settings */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Crypto Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.crypto.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    crypto: { ...settings.crypto, enabled: e.target.checked }
                  })}
                  className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
                />
                <span className="ml-2 text-gray-300">Enable Crypto Payments</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Supported Networks</label>
              <div className="mt-2 space-y-2">
                {['ethereum', 'polygon', 'binance'].map((network) => (
                  <label key={network} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.crypto.networks.includes(network)}
                      onChange={(e) => {
                        const networks = e.target.checked
                          ? [...settings.crypto.networks, network]
                          : settings.crypto.networks.filter(n => n !== network);
                        setSettings({
                          ...settings,
                          crypto: { ...settings.crypto, networks }
                        });
                      }}
                      className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
                    />
                    <span className="ml-2 text-gray-300 capitalize">{network}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Accepted Tokens</label>
              <div className="mt-2 space-y-2">
                {['ETH', 'USDC', 'MATIC', 'BNB'].map((token) => (
                  <label key={token} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.crypto.tokens.includes(token)}
                      onChange={(e) => {
                        const tokens = e.target.checked
                          ? [...settings.crypto.tokens, token]
                          : settings.crypto.tokens.filter(t => t !== token);
                        setSettings({
                          ...settings,
                          crypto: { ...settings.crypto, tokens }
                        });
                      }}
                      className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
                    />
                    <span className="ml-2 text-gray-300">{token}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Subscription Plans</h3>
        <div className="space-y-4">
          {settings.plans.map((plan) => (
            <div key={plan.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{plan.name}</h4>
                  <p className="text-sm text-gray-400">
                    ${plan.price}/month
                  </p>
                </div>
                <button className="text-[#00E5BE] hover:text-[#00D1AD]">
                  Edit Plan
                </button>
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Features</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {plan.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-gray-600 text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Limits</label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(plan.limits).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 capitalize">{key}</span>
                        <span className="text-sm text-white">
                          {value === -1 ? 'Unlimited' : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Affiliate Settings */}
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Affiliate Program</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.affiliate.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  affiliate: { ...settings.affiliate, enabled: e.target.checked }
                })}
                className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
              />
              <span className="ml-2 text-gray-300">Enable Affiliate Program</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Commission Rate (%)</label>
            <input
              type="number"
              value={settings.affiliate.commission}
              onChange={(e) => setSettings({
                ...settings,
                affiliate: { ...settings.affiliate, commission: parseInt(e.target.value) }
              })}
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Minimum Payout ($)</label>
            <input
              type="number"
              value={settings.affiliate.minPayout}
              onChange={(e) => setSettings({
                ...settings,
                affiliate: { ...settings.affiliate, minPayout: parseInt(e.target.value) }
              })}
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h5 className="text-white font-medium">Payment Processing Notice</h5>
            <p className="mt-1 text-sm text-gray-400">
              Changes to payment settings may affect ongoing subscriptions and transactions.
              Please review all changes carefully before saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;