import React from 'react';
import { BarChart2, Users, Globe, AlertTriangle, Server, Database } from 'lucide-react';

const AdminAnalytics = () => {
  const stats = [
    { name: 'Total Users', value: '12,345', change: '+12%', icon: Users },
    { name: 'Active Sessions', value: '2,456', change: '+5%', icon: Globe },
    { name: 'System Load', value: '45%', change: '-2%', icon: Server },
    { name: 'Database Size', value: '234GB', change: '+8%', icon: Database },
    { name: 'Error Rate', value: '0.12%', change: '-15%', icon: AlertTriangle },
    { name: 'API Requests', value: '1.2M', change: '+25%', icon: BarChart2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">System Overview</h2>
        <div className="flex items-center space-x-2">
          <select className="bg-gray-800 text-gray-300 rounded-lg border-gray-700">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');

          return (
            <div key={stat.name} className="p-6 bg-gray-800 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <h3 className="text-gray-400">{stat.name}</h3>
                </div>
                <span className={`text-sm ${
                  isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
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

        {/* Recent Alerts */}
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

export default AdminAnalytics;