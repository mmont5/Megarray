import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, Settings, Shield, Activity, Database, BarChart2, 
  Key, Server, Globe, Mail, AlertTriangle, Terminal
} from 'lucide-react';
import AdminAnalytics from './AdminAnalytics';
import AdminUsers from './AdminUsers';
import AdminSecurity from './AdminSecurity';
import AdminSystem from './AdminSystem';
import AdminIntegrations from './AdminIntegrations';
import AdminLogs from './AdminLogs';

const AdminDashboard = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const navigation = [
    { name: 'Overview', href: '/admin', icon: BarChart2 },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Security', href: '/admin/security', icon: Shield },
    { name: 'System', href: '/admin/system', icon: Server },
    { name: 'Integrations', href: '/admin/integrations', icon: Database },
    { name: 'Logs', href: '/admin/logs', icon: Terminal },
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`${isMenuOpen ? 'w-64' : 'w-20'} bg-gray-800 transition-all duration-300`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h1 className={`font-semibold text-red-500 ${!isMenuOpen && 'hidden'}`}>
              ADMIN PANEL
            </h1>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 text-gray-400"
            >
              <svg
                className={`w-6 h-6 transform transition-transform ${isMenuOpen ? 'rotate-0' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-red-500 text-white'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isMenuOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2 text-gray-400">
              <Shield className="w-5 h-5" />
              {isMenuOpen && <span>Super Admin Mode</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-900">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<AdminAnalytics />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/security" element={<AdminSecurity />} />
            <Route path="/system" element={<AdminSystem />} />
            <Route path="/integrations" element={<AdminIntegrations />} />
            <Route path="/logs" element={<AdminLogs />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;