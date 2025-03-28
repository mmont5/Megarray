import React, { useState } from 'react';
import { BarChart2, TrendingUp, Clock, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const performanceData = [
  { date: '2024-03-01', cpu: 45, memory: 62, requests: 1200 },
  { date: '2024-03-02', cpu: 48, memory: 65, requests: 1300 },
  { date: '2024-03-03', cpu: 52, memory: 70, requests: 1400 },
  { date: '2024-03-04', cpu: 55, memory: 72, requests: 1600 },
  { date: '2024-03-05', cpu: 58, memory: 75, requests: 1800 },
];

const Performance = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [metric, setMetric] = useState('cpu');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">System Performance</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 text-gray-300 rounded-lg border-gray-700"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="bg-gray-800 text-gray-300 rounded-lg border-gray-700"
          >
            <option value="cpu">CPU Usage</option>
            <option value="memory">Memory Usage</option>
            <option value="requests">Request Rate</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">CPU Usage</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">45%</p>
          <p className="mt-2 text-sm text-gray-400">Peak: 58%</p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Memory Usage</h3>
            <TrendingUp className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">62%</p>
          <p className="mt-2 text-sm text-gray-400">Peak: 75%</p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Request Rate</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">1,800/s</p>
          <p className="mt-2 text-sm text-gray-400">Peak: 2,100/s</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Performance Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resource Usage History</h3>
          <div className="space-y-4">
            {[
              { name: 'Database Connections', current: 85, max: 100 },
              { name: 'Cache Size', current: 2.1, max: 4, unit: 'GB' },
              { name: 'Network Bandwidth', current: 450, max: 1000, unit: 'Mbps' },
              { name: 'Storage Usage', current: 75, max: 100, unit: 'GB' },
            ].map((resource) => (
              <div key={resource.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{resource.name}</span>
                  <span className="text-white">
                    {resource.current}{resource.unit ? resource.unit : '%'} / {resource.max}{resource.unit ? resource.unit : '%'}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      (resource.current / resource.max) > 0.8 ? 'bg-red-500' :
                      (resource.current / resource.max) > 0.6 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(resource.current / resource.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Response Time Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { range: '0-100ms', count: 4500 },
                  { range: '100-200ms', count: 2800 },
                  { range: '200-300ms', count: 1200 },
                  { range: '300-400ms', count: 800 },
                  { range: '400-500ms', count: 400 },
                  { range: '500ms+', count: 200 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="range" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;