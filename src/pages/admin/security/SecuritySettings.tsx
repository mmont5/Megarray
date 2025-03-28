import React, { useState } from 'react';
import { Shield, Key, Lock, AlertCircle, RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';

const SecuritySettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    twoFactorRequired: true,
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true,
      expiryDays: 90,
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    ipWhitelist: [] as string[],
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          category: 'security',
          settings: settings,
        });

      if (error) throw error;
      toast.success('Security settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-[#00E5BE]" />
          <h2 className="text-2xl font-bold text-white">Security Settings</h2>
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
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Authentication</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.twoFactorRequired}
                  onChange={(e) => setSettings({ ...settings, twoFactorRequired: e.target.checked })}
                  className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
                />
                <span className="ml-2 text-gray-300">Require Two-Factor Authentication</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Max Login Attempts</label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Password Policy</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Minimum Length</label>
              <input
                type="number"
                value={settings.passwordPolicy.minLength}
                onChange={(e) => setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    minLength: parseInt(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireUppercase}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      requireUppercase: e.target.checked
                    }
                  })}
                  className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
                />
                <span className="ml-2 text-gray-300">Require Uppercase Letters</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireNumbers}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      requireNumbers: e.target.checked
                    }
                  })}
                  className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
                />
                <span className="ml-2 text-gray-300">Require Numbers</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireSymbols}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      requireSymbols: e.target.checked
                    }
                  })}
                  className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
                />
                <span className="ml-2 text-gray-300">Require Special Characters</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password Expiry (days)</label>
              <input
                type="number"
                value={settings.passwordPolicy.expiryDays}
                onChange={(e) => setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    expiryDays: parseInt(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">IP Whitelist</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter IP address"
              className="flex-1 rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
            />
            <button className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]">
              Add IP
            </button>
          </div>

          <div className="space-y-2">
            {settings.ipWhitelist.map((ip, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                <span className="text-white">{ip}</span>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    ipWhitelist: settings.ipWhitelist.filter((_, i) => i !== index)
                  })}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700/50">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />
          <div>
            <h5 className="text-white font-medium">Important Security Notice</h5>
            <p className="mt-1 text-sm text-gray-400">
              Changes to security settings may affect all users and require them to update their credentials.
              Make sure to communicate any changes to your team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;