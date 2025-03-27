import React, { useState } from 'react';
import { Terminal, Search, Filter, Download, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const AdminLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterService, setFilterService] = useState('all');

  const logs = [
    {
      id: '1',
      timestamp: '2024-03-15T10:30:00',
      level: 'error',
      service: 'api',
      message: 'Database connection timeout',
      details: 'Connection to primary database failed after 30s',
    },
    {
      id: '2',
      timestamp: '2024-03-15T10:29:00',
      level: 'info',
      service: 'auth',
      message: 'New user registration',
      details: 'User registered with email: john@example.com',
    },
    {
      id: '3',
      timestamp: '2024-03-15T10:28:00',
      level: 'warning',
      service: 'cache',
      message: 'Cache invalidation failed',
      details: 'Unable to clear user session cache',
    },
    // Add more mock logs as needed
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesService = filterService === 'all' || log.service === filterService;
    return matchesSearch && matchesLevel && matchesService;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">System Logs</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-white">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-500"
          />
        </div>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700"
        >
          <option value="all">All Levels</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
        <select
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700"
        >
          <option value="all">All Services</option>
          <option value="api">API</option>
          <option value="auth">Auth</option>
          <option value="cache">Cache</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Showing {filteredLogs.length} logs</span>
            <div className="flex items-center space-x-4">
              <span>Auto-refresh: 30s</span>
              <button className="text-red-500 hover:text-red-400">
                Clear Logs
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-700">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  log.level === 'error' ? 'bg-red-500' :
                  log.level === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}>
                  {log.level === 'error' && <AlertTriangle className="w-4 h-4 text-white" />}
                  {log.level === 'warning' && <AlertTriangle className="w-4 h-4 text-white" />}
                  {log.level === 'info' && <Info className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{log.message}</span>
                    <span className="text-sm text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-3">
                    <span className={`text-sm ${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-400">{log.service}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{log.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-800 rounded-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Log Stats</h3>
          <select className="bg-gray-700 text-white rounded-lg border-gray-600">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Error Rate</span>
              <span className="text-red-500">2.3%</span>
            </div>
            <div className="mt-2 h-2 bg-gray-600 rounded-full">
              <div className="h-2 bg-red-500 rounded-full" style={{ width: '2.3%' }} />
            </div>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Warning Rate</span>
              <span className="text-yellow-500">5.7%</span>
            </div>
            <div className="mt-2 h-2 bg-gray-600 rounded-full">
              <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '5.7%' }} />
            </div>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Success Rate</span>
              <span className="text-green-500">92%</span>
            </div>
            <div className="mt-2 h-2 bg-gray-600 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '92%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;