import React from 'react';
import { Database, RefreshCw, Settings, Shield, AlertTriangle } from 'lucide-react';

const AdminIntegrations = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Integration Management</h2>
        <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          <Database className="w-5 h-5 mr-2" />
          Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OpenAI Integration */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-700 rounded-lg">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.268a4.476 4.476 0 0 1 2.343-1.97V11.8a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 8.268zm16.597 3.855l-5.833-3.387L15.119 7.57a.076.076 0 0 1 .071 0l4.83 2.786a4.494 4.494 0 0 1-.676 8.137v-5.505a.795.795 0 0 0-.407-.67zm2.01-3.055l-.141-.085-4.774-2.782a.776.776 0 0 0-.784 0L9.409 9.57V7.242a.08.08 0 0 1 .033-.062l4.84-2.796a4.5 4.5 0 0 1 6.675 4.684zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.398a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.392.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">OpenAI</h3>
                <p className="text-sm text-gray-400">AI Content Generation</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
              Active
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">API Usage</span>
              <span className="text-white">85%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }} />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>42,500 / 50,000 tokens</span>
              <span>Reset in 3 days</span>
            </div>
          </div>
          <div className="mt-6 flex space-x-2">
            <button className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <Settings className="w-4 h-4 inline mr-2" />
              Configure
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Sync
            </button>
          </div>
        </div>

        {/* Supabase Integration */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-700 rounded-lg">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.659z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Supabase</h3>
                <p className="text-sm text-gray-400">Database & Authentication</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
              Warning
            </span>
          </div>
          <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700/50">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-white">High Database Usage</p>
                <p className="text-sm text-gray-400">Consider upgrading your plan</p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Storage Usage</span>
              <span className="text-white">92%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '92%' }} />
            </div>
          </div>
          <div className="mt-6 flex space-x-2">
            <button className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <Shield className="w-4 h-4 inline mr-2" />
              Security
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Integration Logs */}
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Integration Logs</h3>
        <div className="space-y-4">
          {[
            { type: 'error', service: 'OpenAI', message: 'Rate limit exceeded', time: '5 minutes ago' },
            { type: 'success', service: 'Supabase', message: 'Backup completed', time: '1 hour ago' },
            { type: 'warning', service: 'Stripe', message: 'Webhook failed', time: '2 hours ago' },
            { type: 'info', service: 'SendGrid', message: 'API key rotated', time: '1 day ago' },
          ].map((log, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700">
              <div className={`p-2 rounded-full ${
                log.type === 'error' ? 'bg-red-500' :
                log.type === 'success' ? 'bg-green-500' :
                log.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}>
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{log.service}</span>
                  <span className="text-sm text-gray-400">{log.time}</span>
                </div>
                <p className="text-sm text-gray-400">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminIntegrations;