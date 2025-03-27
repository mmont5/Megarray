import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Settings, Database, Shield, Activity, 
  BarChart2, Brain, FileText, CreditCard
} from 'lucide-react';
import Analytics from '../components/Analytics';
import Integrations from '../components/Integrations';
import ContentCalendar from '../components/ContentCalendar';
import ContentCreator from '../components/ContentCreator';
import ABTesting from '../components/ABTesting';
import AdManager from '../components/AdManager';
import AutoPilotToggle from '../components/AutoPilotToggle';
import ReportGenerator from '../components/ReportGenerator';
import Billing from '../components/Billing';

const Dashboard = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
    { name: 'Content', href: '/dashboard/content', icon: Brain },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Integrations', href: '/dashboard/integrations', icon: Database },
    { name: 'Activity', href: '/dashboard/activity', icon: Activity },
    { name: 'Security', href: '/dashboard/security', icon: Shield },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const UsersPage = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Users</h2>
      <p className="mt-4 text-gray-600">User management coming soon...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isMenuOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className={`font-semibold text-gray-900 ${!isMenuOpen && 'hidden'}`}>
              Dashboard
            </h1>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                className={`w-6 h-6 text-gray-600 transform transition-transform ${isMenuOpen ? 'rotate-0' : 'rotate-180'}`}
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
                      ? 'bg-[#00E5BE] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isMenuOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <AutoPilotToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ContentCreator />
                  <ContentCalendar />
                  <Analytics />
                  <ABTesting />
                  <AdManager />
                </div>
              </div>
            } />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/content" element={
              <div className="space-y-8">
                <ContentCreator />
                <ContentCalendar />
                <ABTesting />
              </div>
            } />
            <Route path="/reports" element={<ReportGenerator />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/activity" element={
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Activity</h2>
                <p className="mt-4 text-gray-600">Activity logs coming soon...</p>
              </div>
            } />
            <Route path="/security" element={
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Security</h2>
                <p className="mt-4 text-gray-600">Security settings coming soon...</p>
              </div>
            } />
            <Route path="/settings" element={
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="mt-4 text-gray-600">Account settings coming soon...</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;