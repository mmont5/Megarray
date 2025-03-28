import React, { useState } from 'react';
import { Zap, RefreshCw, Settings, Key, Copy, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';

const APISettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    rateLimits: {
      public: 100,
      authenticated: 1000,
      admin: 5000,
    },
    keyExpiry: 90,
    apiKeys: [
      {
        id: '1',
        name: 'Production API Key',
        key: 'sk_prod_...3f9d',
        created: '2024-03-01',
        lastUsed: '2024-03-15',
        permissions: ['read', 'write'],
      },
      {
        id: '2',
        name: 'Development API Key',
        key: 'sk_dev_...8a2c',
        created: '2024-03-10',
        lastUsed: '2024-03-14',
        permissions: ['read'],
      },
    ],
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          category: 'api',
          settings: settings,
        });

      if (error) throw error;
      toast.success('API settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to update API settings');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-api-key');
      if (error) throw error;
      toast.success('API key generated successfully');
      // Update API keys list
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-[#00E5BE]" />
          <h2 className="text-2xl font-bold text-white">API Settings</h2>
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
        {/* Rate Limits */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Rate Limits</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Public API (requests/minute)</label>
              <input
                type="number"
                value={settings.rateLimits.public}
                onChange={(e) => setSettings({
                  ...settings,
                  rateLimits: { ...settings.rateLimits, public: parseInt(e.target.value) }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Authenticated API (requests/minute)</label>
              <input
                type="number"
                value={settings.rateLimits.authenticated}
                onChange={(e) => setSettings({
                  ...settings,
                  rateLimits: { ...settings.rateLimits, authenticated: parseInt(e.target.value) }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Admin API (requests/minute)</label>
              <input
                type="number"
                value={settings.rateLimits.admin}
                onChange={(e) => setSettings({
                  ...settings,
                  rateLimits: { ...settings.rateLimits, admin: parseInt(e.target.value) }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
          </div>
        </div>

        {/* API Key Settings */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">API Key Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">API Key Expiry (days)</label>
              <input
                type="number"
                value={settings.keyExpiry}
                onChange={(e) => setSettings({ ...settings, keyExpiry: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>

            <button
              onClick={generateApiKey}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              <Key className="w-5 h-5 inline mr-2" />
              Generate New API Key
            </button>
          </div>
        </div>
      </div>

      {/* API Keys List */}
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">API Keys</h3>
        <div className="space-y-4">
          {settings.apiKeys.map((key) => (
            <div key={key.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{key.name}</h4>
                  <p className="text-sm text-gray-400">Created: {key.created}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(key.key)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-400">
                    Revoke
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <code className="px-2 py-1 bg-gray-800 rounded text-sm text-gray-300">
                  {key.key}
                </code>
                <span className="text-sm text-gray-400">
                  Last used: {key.lastUsed}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {key.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-2 py-1 text-xs font-medium rounded-full bg-gray-600 text-gray-300"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700/50">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
          <div>
            <h5 className="text-white font-medium">API Security Notice</h5>
            <p className="mt-1 text-sm text-gray-400">
              API keys provide full access to your account. Keep them secure and never share them
              in client-side code or public repositories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APISettings;