import React from 'react';
import { Shield, Key, Lock, AlertTriangle, RefreshCw, Eye, EyeOff } from 'lucide-react';

const AdminSecurity = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Security Settings</h2>
        <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          <Shield className="w-5 h-5 mr-2" />
          Security Audit
        </button>
      </div>

      {/* Authentication Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Authentication</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Require 2FA for all admin accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Session Timeout</p>
                <p className="text-sm text-gray-400">Automatically logout after inactivity</p>
              </div>
              <select className="bg-gray-700 text-white rounded-lg border-gray-600">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Password Policy</p>
                <p className="text-sm text-gray-400">Minimum requirements for passwords</p>
              </div>
              <button className="text-gray-400 hover:text-white">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* API Security */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">API Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">API Rate Limiting</p>
                <p className="text-sm text-gray-400">Limit API requests per minute</p>
              </div>
              <input
                type="number"
                className="w-20 px-3 py-1 bg-gray-700 text-white rounded-lg border border-gray-600"
                defaultValue="100"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">API Key Rotation</p>
                <p className="text-sm text-gray-400">Automatically rotate API keys</p>
              </div>
              <select className="bg-gray-700 text-white rounded-lg border-gray-600">
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
              </select>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <Key className="w-5 h-5 inline mr-2" />
              Generate New API Key
            </button>
          </div>
        </div>
      </div>

      {/* Security Logs */}
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Security Events</h3>
        <div className="space-y-4">
          {[
            { type: 'warning', message: 'Failed login attempt from IP 192.168.1.100', time: '5 minutes ago' },
            { type: 'info', message: 'API key rotated for production environment', time: '1 hour ago' },
            { type: 'error', message: 'Unauthorized access attempt to admin panel', time: '2 hours ago' },
            { type: 'success', message: 'Security audit completed successfully', time: '1 day ago' },
          ].map((event, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700">
              <div className={`p-2 rounded-full ${
                event.type === 'warning' ? 'bg-yellow-500' :
                event.type === 'error' ? 'bg-red-500' :
                event.type === 'success' ? 'bg-green-500' :
                'bg-blue-500'
              }`}>
                {event.type === 'warning' && <AlertTriangle className="w-4 h-4 text-white" />}
                {event.type === 'error' && <Lock className="w-4 h-4 text-white" />}
                {event.type === 'success' && <Shield className="w-4 h-4 text-white" />}
                {event.type === 'info' && <RefreshCw className="w-4 h-4 text-white" />}
              </div>
              <div className="flex-1">
                <p className="text-white">{event.message}</p>
                <p className="text-sm text-gray-400">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;