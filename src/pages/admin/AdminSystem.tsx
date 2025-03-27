import React from 'react';
import { Server, Database, Globe, Cloud, RefreshCw, Settings, Terminal } from 'lucide-react';

const AdminSystem = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">System Configuration</h2>
        <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          <RefreshCw className="w-5 h-5 mr-2" />
          Restart System
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Configuration */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Server Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Environment</p>
                <p className="text-sm text-gray-400">Current running environment</p>
              </div>
              <select className="bg-gray-700 text-white rounded-lg border-gray-600">
                <option>Production</option>
                <option>Staging</option>
                <option>Development</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Node Version</p>
                <p className="text-sm text-gray-400">Server runtime version</p>
              </div>
              <span className="text-gray-400">v18.19.0</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Memory Limit</p>
                <p className="text-sm text-gray-400">Maximum memory allocation</p>
              </div>
              <input
                type="text"
                className="w-24 px-3 py-1 bg-gray-700 text-white rounded-lg border border-gray-600"
                defaultValue="4096MB"
              />
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Database Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Connection Pool</p>
                <p className="text-sm text-gray-400">Maximum concurrent connections</p>
              </div>
              <input
                type="number"
                className="w-20 px-3 py-1 bg-gray-700 text-white rounded-lg border border-gray-600"
                defaultValue="100"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Backup Schedule</p>
                <p className="text-sm text-gray-400">Automated backup frequency</p>
              </div>
              <select className="bg-gray-700 text-white rounded-lg border-gray-600">
                <option>Every 6 hours</option>
                <option>Every 12 hours</option>
                <option>Daily</option>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white">API Cache</h4>
              <button className="text-gray-400 hover:text-white">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                
                <span className="text-gray-400">Size</span>
                <span className="text-white">256MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">TTL</span>
                <span className="text-white">1 hour</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white">Session Cache</h4>
              <button className="text-gray-400 hover:text-white">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Size</span>
                <span className="text-white">128MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">TTL</span>
                <span className="text-white">24 hours</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white">Static Cache</h4>
              <button className="text-gray-400 hover:text-white">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Size</span>
                <span className="text-white">1GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">TTL</span>
                <span className="text-white">7 days</span>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default AdminSystem;