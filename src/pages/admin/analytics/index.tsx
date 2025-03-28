import React, { useState } from 'react';
import { BarChart2, TrendingUp, Terminal } from 'lucide-react';
import Overview from './Overview';
import Performance from './Performance';
import Logs from './Logs';

const AdminAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart2, component: Overview },
    { id: 'performance', name: 'Performance', icon: TrendingUp, component: Performance },
    { id: 'logs', name: 'System Logs', icon: Terminal, component: Logs },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Overview;

  return (
    <div className="space-y-6">
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

export default AdminAnalytics;