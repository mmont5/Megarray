import React, { useState } from 'react';
import { Plug, Plus, Check, X, ExternalLink, Key, Shield, RefreshCw, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'ai' | 'marketing' | 'crm' | 'automation' | 'analytics';
  connected: boolean;
  status?: 'active' | 'error' | 'pending';
  lastSync?: string;
}

const integrations: Integration[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Advanced AI models for content generation',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.268a4.476 4.476 0 0 1 2.343-1.97V11.8a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 8.268zm16.597 3.855l-5.833-3.387L15.119 7.57a.076.076 0 0 1 .071 0l4.83 2.786a4.494 4.494 0 0 1-.676 8.137v-5.505a.795.795 0 0 0-.407-.67zm2.01-3.055l-.141-.085-4.774-2.782a.776.776 0 0 0-.784 0L9.409 9.57V7.242a.08.08 0 0 1 .033-.062l4.84-2.796a4.5 4.5 0 0 1 6.675 4.684zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.398a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.392.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>,
    category: 'ai',
    connected: true,
    status: 'active',
    lastSync: '2 minutes ago',
  },
  {
    id: 'azure',
    name: 'Azure AI',
    description: 'Microsoft\'s AI services and models',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M21.996 11.6c0 .11-.09.2-.2.2h-1.86a.2.2 0 0 1-.194-.147l-3.236-9.933a.2.2 0 0 0-.193-.147h-5.283a.2.2 0 0 0-.194.147l-3.236 9.933a.2.2 0 0 1-.194.147H2.204a.2.2 0 0 1-.2-.2v-.4c0-.11.09-.2.2-.2h4.6a.2.2 0 0 0 .194-.147l3.236-9.933a.2.2 0 0 1 .194-.147h5.283a.2.2 0 0 1 .193.147l3.236 9.933a.2.2 0 0 0 .194.147h1.86c.11 0 .2.09.2.2v.4z"/></svg>,
    category: 'ai',
    connected: false,
  },
];

const Integrations = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConnect = (integrationId: string) => {
    toast.success(`Connected to ${integrations.find(i => i.id === integrationId)?.name}`);
  };

  const handleDisconnect = (integrationId: string) => {
    toast.success(`Disconnected from ${integrations.find(i => i.id === integrationId)?.name}`);
  };

  const handleSync = (integrationId: string) => {
    toast.success(`Syncing with ${integrations.find(i => i.id === integrationId)?.name}`);
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Plug className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-gray-900">Integrations</h3>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integrations..."
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE]"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE]"
          >
            <option value="all">All Categories</option>
            <option value="ai">AI Services</option>
            <option value="marketing">Marketing</option>
            <option value="crm">CRM</option>
            <option value="automation">Automation</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="p-6 rounded-xl border border-gray-200 hover:border-[#00E5BE] transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {integration.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              {integration.connected ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSync(integration.id)}
                    className="p-1 text-gray-500 hover:text-[#00E5BE]"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="p-1 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(integration.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Connect</span>
                </button>
              )}
            </div>

            {integration.connected && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    {integration.status === 'active' && (
                      <span className="flex items-center text-green-600">
                        <Check className="w-4 h-4 mr-1" />
                        Active
                      </span>
                    )}
                    {integration.status === 'error' && (
                      <span className="flex items-center text-red-600">
                        <X className="w-4 h-4 mr-1" />
                        Error
                      </span>
                    )}
                    {integration.status === 'pending' && (
                      <span className="flex items-center text-yellow-600">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending
                      </span>
                    )}
                    {integration.lastSync && (
                      <span className="text-gray-500">
                        Last sync: {integration.lastSync}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-500 hover:text-gray-700">
                      <Key className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Shield className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h5 className="font-medium text-blue-900">Security Note</h5>
            <p className="mt-1 text-sm text-blue-700">
              All API keys and access tokens are encrypted and stored securely. Integration activity is logged and monitored for security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;