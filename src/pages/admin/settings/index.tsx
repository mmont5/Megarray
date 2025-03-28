import React, { useState } from 'react';
import { Settings as SettingsIcon, Server, Mail, Zap, CreditCard } from 'lucide-react';
import SystemSettings from './SystemSettings';
import EmailSettings from './EmailSettings';
import APISettings from './APISettings';
import BillingSettings from './BillingSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', name: 'System', icon: Server, component: SystemSettings },
    { id: 'email', name: 'Email', icon: Mail, component: EmailSettings },
    { id: 'api', name: 'API', icon: Zap, component: APISettings },
    { id: 'billing', name: 'Billing', icon: CreditCard, component: BillingSettings },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || SystemSettings;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="w-5 h-5 text-[#00E5BE]" />
        <h2 className="text-2xl font-bold text-white">Settings</h2>
      </div>

      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-[#00E5BE] text-[#00E5BE]'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <ActiveComponent />
    </div>
  );
};

export default Settings;