import React, { useState } from 'react';
import { BarChart2, Users, Globe, AlertTriangle, Server, Database, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const userActivityData = [
  { date: '2024-03-01', activeUsers: 8234, newUsers: 156, churnedUsers: 42 },
  { date: '2024-03-02', activeUsers: 8512, newUsers: 178, churnedUsers: 38 },
  { date: '2024-03-03', activeUsers: 8876, newUsers: 201, churnedUsers: 45 },
  { date: '2024-03-04', activeUsers: 9123, newUsers: 189, churnedUsers: 51 },
  { date: '2024-03-05', activeUsers: 9345, newUsers: 167, churnedUsers: 47 },
];

const revenueData = [
  { date: '2024-03-01', subscriptions: 12500, oneTime: 2500, affiliate: 800 },
  { date: '2024-03-02', subscriptions: 13200, oneTime: 3100, affiliate: 950 },
  { date: '2024-03-03', subscriptions: 14100, oneTime: 2800, affiliate: 1100 },
  { date: '2024-03-04', subscriptions: 15000, oneTime: 3400, affiliate: 1250 },
  { date: '2024-03-05', subscriptions: 15800, oneTime: 3200, affiliate: 1400 },
];

const contentMetrics = [
  { date: '2024-03-01', posts: 450, engagement: 2300, shares: 890 },
  { date: '2024-03-02', posts: 520, engagement: 2800, shares: 1020 },
  { date: '2024-03-03', posts: 480, engagement: 2600, shares: 950 },
  { date: '2024-03-04', posts: 550, engagement: 3100, shares: 1150 },
  { date: '2024-03-05', posts: 510, engagement: 2900, shares: 1080 },
];

const Overview = () => {
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics Overview</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-800 text-gray-300 rounded-lg border-gray-700"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-400">Total Users</h3>
            </div>
            <span className="text-sm text-green-500">+12%</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-white">12,345</p>
          <p className="mt-2 text-sm text-gray-400">8,234 active users</p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-400">Revenue</h3>
            </div>
            <span className="text-sm text-green-500">+8%</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-white">$45,678</p>
          <p className="mt-2 text-sm text-gray-400">$5,678 today</p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-400">Content</h3>
            </div>
            <span className="text-sm text-green-500">+15%</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-white">2,456</p>
          <p className="mt-2 text-sm text-gray-400">510 posts today</p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-400">Engagement</h3>
            </div>
            <span className="text-sm text-green-500">+18%</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-white">89.2%</p>
          <p className="mt-2 text-sm text-gray-400">2,900 interactions</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">User Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="activeUsers" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="newUsers" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="churnedUsers" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                  }}
                  formatter={(value) => `$${value}`}
                />
                <Legend />
                <Bar dataKey="subscriptions" fill="#10B981" />
                <Bar dataKey="oneTime" fill="#3B82F6" />
                <Bar dataKey="affiliate" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Content Performance */}
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-6">Content Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={contentMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="posts" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="shares" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { name: 'CPU Usage', value: 45 },
              { name: 'Memory Usage', value: 62 },
              { name: 'Disk Space', value: 78 },
              { name: 'Network Load', value: 34 },
            ].map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{metric.name}</span>
                  <span className="text-white">{metric.value}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      metric.value > 80 ? 'bg-red-500' :
                      metric.value > 60 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {[
              { level: 'error', message: 'Database connection timeout', time: '5 minutes ago' },
              { level: 'warning', message: 'High memory usage detected', time: '15 minutes ago' },
              { level: 'info', message: 'System backup completed', time: '1 hour ago' },
              { level: 'error', message: 'API rate limit exceeded', time: '2 hours ago' },
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700">
                <div className={`p-1 rounded-full ${
                  alert.level === 'error' ? 'bg-red-500' :
                  alert.level === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div>
                  <p className="text-white">{alert.message}</p>
                  <p className="text-sm text-gray-400">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;