import React, { useState } from 'react';
import { Server, Database, Cloud, RefreshCw, Settings, Terminal, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';

const SystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    environment: 'production',
    nodeVersion: 'v18.19.0',
    memoryLimit: '4096',
    connectionPool: '100',
    backupSchedule: '6',
    cacheSettings: {
      api: {
        size: '256',
        ttl: '3600',
      },
      session: {
        size: '128',
        ttl: '86400',
      },
      static: {
        size: '1024',
        ttl: '604800',
      },
    },
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          category: 'system',
          settings: settings,
        });

      if (error) throw error;
      toast.success('System settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to update system settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Server className="w-5 h-5 text-[#00E5BE]" />
          <h2 className="text-2xl font-bold text-white">System Settings</h2>
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
        {/* Server Configuration */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Server Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Environment</label>
              <select
                value={settings.environment}
                onChange={(e) => setSettings({ ...settings, environment: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Node Version</label>
              <input
                type="text"
                value={settings.nodeVersion}
                disabled
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white opacity-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Memory Limit (MB)</label>
              <input
                type="number"
                value={settings.memoryLimit}
                onChange={(e) => setSettings({ ...settings, memoryLimit: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Database Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Connection Pool Size</label>
              <input
                type="number"
                value={settings.connectionPool}
                onChange={(e) => setSettings({ ...settings, connectionPool: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Backup Schedule (hours)</label>
              <select
                value={settings.backupSchedule}
                onChange={(e) => setSettings({ ...settings, backupSchedule: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              >
                <option value="6">Every 6 hours</option>
                <option value="12">Every 12 hours</option>
                <option value="24">Daily</option>
              </select>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <Database className="w-5 h-5 inline mr-2" />
              Backup Now
            </button>
          </div>
        </div>
      </div>

      {/* Cache Management */}
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Cache Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(settings.cacheSettings).map(([type, config]) => (
            <div key={type} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white capitalize">{type} Cache</h4>
                <button className="text-gray-400 hover:text-white">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Size (MB)</label>
                  <input
                    type="number"
                    value={config.size}
                    onChange={(e) => setSettings({
                      ...settings,
                      cacheSettings: {
                        ...settings.cacheSettings,
                        [type]: { ...config, size: e.target.value }
                      }
                    })}
                    className="mt-1 block w-full rounded-lg bg-gray-600 border-gray-500 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">TTL (seconds)</label>
                  <input
                    type="number"
                    value={config.ttl}
                    onChange={(e) => setSettings({
                      ...settings,
                      cacheSettings: {
                        ...settings.cacheSettings,
                        [type]: { ...config, ttl: e.target.value }
                      }
                    })}
                    className="mt-1 block w-full rounded-lg bg-gray-600 border-gray-500 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Commands */}
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">System Commands</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <Terminal className="w-5 h-5 inline mr-2" />
              Clear All Caches
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <Settings className="w-5 h-5 inline mr-2" />
              Rebuild Indexes
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <Cloud className="w-5 h-5 inline mr-2" />
              Sync Storage
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700/50">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
          <div>
            <h5 className="text-white font-medium">System Maintenance Notice</h5>
            <p className="mt-1 text-sm text-gray-400">
              Some system settings changes may require a server restart. Please schedule maintenance
              windows for major configuration changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;