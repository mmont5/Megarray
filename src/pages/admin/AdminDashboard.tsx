import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Settings, Database, Shield, Activity, 
  BarChart2, Link2, Server, Globe, Mail, AlertTriangle, Terminal,
  Menu, X, ChevronDown, Bell, Search, User, FileText, Brain,
  Wallet, Target, Calendar, MessageSquare, Zap, Box, Key
} from 'lucide-react';

import AdminAnalytics from './analytics';
import AdminUsers from './AdminUsers';
import AdminSecurity from './AdminSecurity';
import AdminSystem from './AdminSystem';
import AdminIntegrations from './AdminIntegrations';
import AdminLogs from './AdminLogs';
import AffiliateManagement from './AffiliateManagement';
import RoleManagement from './RoleManagement';
import UserPermissions from './UserPermissions';

interface NavSection {
  name: string;
  items: {
    name: string;
    href: string;
    icon: React.FC<{ className?: string }>;
  }[];
}

const AdminDashboard = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Overview']);

  const navigation: NavSection[] = [
    {
      name: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
      ]
    },
    {
      name: 'User Management',
      items: [
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Roles', href: '/admin/roles', icon: Shield },
        { name: 'Permissions', href: '/admin/permissions', icon: Key },
      ]
    },
    {
      name: 'Content',
      items: [
        { name: 'Content Manager', href: '/admin/content', icon: FileText },
        { name: 'AI Models', href: '/admin/ai-models', icon: Brain },
        { name: 'Scheduling', href: '/admin/scheduling', icon: Calendar },
      ]
    },
    {
      name: 'Marketing',
      items: [
        { name: 'Advertising', href: '/admin/advertising', icon: Target },
        { name: 'Affiliates', href: '/admin/affiliates', icon: Link2 },
        { name: 'Email Campaigns', href: '/admin/email', icon: Mail },
      ]
    },
    {
      name: 'Finance',
      items: [
        { name: 'Payments', href: '/admin/payments', icon: Wallet },
        { name: 'Subscriptions', href: '/admin/subscriptions', icon: Box },
      ]
    },
    {
      name: 'System',
      items: [
        { name: 'Integrations', href: '/admin/integrations', icon: Database },
        { name: 'Security', href: '/admin/security', icon: Shield },
        { name: 'API', href: '/admin/api', icon: Zap },
        { name: 'Logs', href: '/admin/logs', icon: Terminal },
        { name: 'System Status', href: '/admin/system', icon: Server },
      ]
    },
    {
      name: 'Support',
      items: [
        { name: 'Help Center', href: '/admin/help', icon: MessageSquare },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    },
  ];

  const notifications = [
    {
      id: 1,
      title: 'New User Registration',
      message: 'A new user has registered and requires approval.',
      time: '5 minutes ago',
      type: 'info'
    },
    {
      id: 2,
      title: 'System Alert',
      message: 'High CPU usage detected on main server.',
      time: '10 minutes ago',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected.',
      time: '15 minutes ago',
      type: 'error'
    }
  ];

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div 
        className={`${
          isMenuOpen ? 'w-64' : 'w-20'
        } bg-gray-800 transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
            <Link 
              to="/admin" 
              className={`text-sm font-bold text-white ${!isMenuOpen && 'hidden'}`}
            >
              Admin Panel
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 text-gray-400"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((section) => (
              <div key={section.name} className="mb-4">
                {isMenuOpen && (
                  <button
                    onClick={() => toggleSection(section.name)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-400 hover:text-white"
                  >
                    <span>{section.name}</span>
                    <ChevronDown 
                      className={`w-3 h-3 transition-transform ${
                        expandedSections.includes(section.name) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}
                {(!isMenuOpen || expandedSections.includes(section.name)) && (
                  <div className="mt-1 space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-3 py-2 text-xs rounded-lg transition-colors duration-200 ${
                            isActive
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {isMenuOpen && <span className="ml-3">{item.name}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center w-full"
            >
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-300" />
              </div>
              {isMenuOpen && (
                <div className="ml-3 text-left">
                  <p className="text-xs font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-400">Super Admin</p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center flex-1">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-900 text-gray-300 pl-10 pr-4 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00E5BE]"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-700 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-medium text-white">
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <Link
              to="/admin/settings"
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-900 p-6">
          <Routes>
            <Route path="/" element={<AdminAnalytics />} />
            <Route path="/analytics/*" element={<AdminAnalytics />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/roles" element={<RoleManagement />} />
            <Route path="/permissions" element={<UserPermissions />} />
            <Route path="/affiliates" element={<AffiliateManagement />} />
            <Route path="/security" element={<AdminSecurity />} />
            <Route path="/system" element={<AdminSystem />} />
            <Route path="/integrations" element={<AdminIntegrations />} />
            <Route path="/logs" element={<AdminLogs />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;