import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Settings, Database, Shield, Activity, 
  BarChart2, Brain, FileText, CreditCard, Menu, X, Bell, Search,
  ChevronDown, User as UserIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Components
import Analytics from '../components/Analytics';
import Integrations from '../components/Integrations';
import ContentCalendar from '../components/ContentCalendar';
import ContentCreator from '../components/ContentCreator';
import ABTesting from '../components/ABTesting';
import AdManager from '../components/AdManager';
import AutoPilotToggle from '../components/AutoPilotToggle';
import ReportGenerator from '../components/ReportGenerator';
import Billing from '../components/Billing';

interface UsageStats {
  aiCredits: { used: number; total: number };
  teamMembers: { used: number; total: number };
  storage: { used: number; total: number };
}

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Overview']);

  const navigation = [
    {
      name: 'Overview',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
      ]
    },
    {
      name: 'Content',
      items: [
        { name: 'Create', href: '/dashboard/content/create', icon: Brain },
        { name: 'Calendar', href: '/dashboard/content/calendar', icon: FileText },
        { name: 'A/B Testing', href: '/dashboard/content/testing', icon: Activity },
      ]
    },
    {
      name: 'Marketing',
      items: [
        { name: 'Campaigns', href: '/dashboard/campaigns', icon: BarChart2 },
        { name: 'Ads', href: '/dashboard/ads', icon: AdManager },
      ]
    },
    {
      name: 'Team',
      items: [
        { name: 'Members', href: '/dashboard/team', icon: Users },
        { name: 'Roles', href: '/dashboard/roles', icon: Shield },
      ]
    },
    {
      name: 'Settings',
      items: [
        { name: 'Integrations', href: '/dashboard/integrations', icon: Database },
        { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    },
  ];

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('id, plans(name)')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .maybeSingle();

      if (subError && subError.code !== 'PGRST116') {
        throw subError;
      }

      if (!subscription) {
        setUsageStats({
          aiCredits: { used: 0, total: 100 },
          teamMembers: { used: 0, total: 1 },
          storage: { used: 0, total: 104857600 },
        });
        return;
      }

      const { data: usage, error: usageError } = await supabase
        .from('subscription_usage')
        .select('*')
        .eq('subscription_id', subscription.id);

      if (usageError) throw usageError;

      setUsageStats({
        aiCredits: {
          used: usage?.find(u => u.feature === 'ai_credits')?.used_amount || 0,
          total: subscription.plans?.name === 'free' ? 100 :
                 subscription.plans?.name === 'pro' ? 1000 : -1,
        },
        teamMembers: {
          used: usage?.find(u => u.feature === 'team_members')?.used_amount || 0,
          total: subscription.plans?.name === 'free' ? 1 :
                 subscription.plans?.name === 'pro' ? 3 : -1,
        },
        storage: {
          used: usage?.find(u => u.feature === 'storage')?.used_amount || 0,
          total: subscription.plans?.name === 'free' ? 104857600 :
                 subscription.plans?.name === 'pro' ? 1073741824 : -1,
        },
      });
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      toast.error('Failed to load usage statistics');
    } finally {
      setLoading(false);
    }
  };

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
        } bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            <Link 
              to="/dashboard" 
              className={`text-lg font-bold text-white ${!isMenuOpen && 'hidden'}`}
            >
              Megarray
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((section) => (
              <div key={section.name} className="mb-4">
                {isMenuOpen && (
                  <button
                    onClick={() => toggleSection(section.name)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-white"
                  >
                    <span>{section.name}</span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
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
                          className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                            isActive
                              ? 'bg-[#00E5BE] text-white'
                              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {isMenuOpen && <span className="ml-3">{item.name}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Usage Stats */}
          {isMenuOpen && !loading && usageStats && (
            <div className="p-4 border-t border-gray-700">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Usage</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">AI Credits</span>
                    <span className="text-white">
                      {usageStats.aiCredits.used}/{usageStats.aiCredits.total === -1 ? '∞' : usageStats.aiCredits.total}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00E5BE] rounded-full"
                      style={{
                        width: usageStats.aiCredits.total === -1
                          ? '0%'
                          : `${Math.min((usageStats.aiCredits.used / usageStats.aiCredits.total) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Team Members</span>
                    <span className="text-white">
                      {usageStats.teamMembers.used}/{usageStats.teamMembers.total === -1 ? '∞' : usageStats.teamMembers.total}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00E5BE] rounded-full"
                      style={{
                        width: usageStats.teamMembers.total === -1
                          ? '0%'
                          : `${Math.min((usageStats.teamMembers.used / usageStats.teamMembers.total) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Storage</span>
                    <span className="text-white">
                      {(usageStats.storage.used / 1048576).toFixed(1)}MB/
                      {usageStats.storage.total === -1 ? '∞' : `${(usageStats.storage.total / 1048576).toFixed(0)}MB`}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00E5BE] rounded-full"
                      style={{
                        width: usageStats.storage.total === -1
                          ? '0%'
                          : `${Math.min((usageStats.storage.used / usageStats.storage.total) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Profile */}
          <div className="p-4 border-t border-gray-700">
            <button className="flex items-center w-full">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-gray-400" />
              </div>
              {isMenuOpen && (
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-white">{user?.email}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role || 'User'}</p>
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
                className="w-full bg-gray-900 text-gray-300 pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700">
                  {[
                    { title: 'New comment on your post', time: '5m ago' },
                    { title: 'Your campaign is live', time: '1h ago' },
                    { title: 'Monthly report ready', time: '2h ago' },
                  ].map((notification, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-700 cursor-pointer"
                    >
                      <p className="text-sm font-medium text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <Link
              to="/dashboard/settings"
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-900 p-6">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-[#00E5BE]" />
                        <span className="text-sm text-gray-300">Total Reach</span>
                      </div>
                      <span className="text-sm text-green-400">+12%</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white">124,892</p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BarChart2 className="w-5 h-5 text-[#00E5BE]" />
                        <span className="text-sm text-gray-300">Engagement</span>
                      </div>
                      <span className="text-sm text-green-400">+8%</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white">5.2%</p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-[#00E5BE]" />
                        <span className="text-sm text-gray-300">AI Credits</span>
                      </div>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {usageStats?.aiCredits.used}/{usageStats?.aiCredits.total === -1 ? '∞' : usageStats?.aiCredits.total}
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-[#00E5BE]" />
                        <span className="text-sm text-gray-300">Conversion Rate</span>
                      </div>
                      <span className="text-sm text-green-400">+15%</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white">2.8%</p>
                  </div>
                </div>

                {/* Analytics Component */}
                <Analytics />

                {/* Content Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ContentCreator />
                  <ContentCalendar />
                </div>

                {/* Marketing Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ABTesting />
                  <AdManager />
                </div>
              </div>
            } />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/content/create" element={<ContentCreator />} />
            <Route path="/content/calendar" element={<ContentCalendar />} />
            <Route path="/content/testing" element={<ABTesting />} />
            <Route path="/campaigns" element={<AdManager />} />
            <Route path="/reports" element={<ReportGenerator />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={
              <div>
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <p className="mt-4 text-gray-400">Account settings coming soon...</p>
              </div>
            } />
          </Routes>
        </main>
      </div>

      {/* Auto-Pilot Toggle */}
      <div className="fixed bottom-4 right-4">
        <AutoPilotToggle />
      </div>
    </div>
  );
};

export default Dashboard;