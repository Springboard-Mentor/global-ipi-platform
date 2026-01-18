import React, { useState, useEffect } from 'react';

const APIHealthCharts = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshInterval, setRefreshInterval] = useState(30);

  const apiMetrics = {
    uptime: '99.97%',
    responseTime: '142ms',
    requestsPerMinute: '1,247',
    errorRate: '0.03%',
    totalRequests: '1,847,293'
  };

  const endpoints = [
    { name: '/api/patents/search', status: 'healthy', responseTime: '89ms', requests: 45678 },
    { name: '/api/users/auth', status: 'healthy', responseTime: '23ms', requests: 12456 },
    { name: '/api/filings/submit', status: 'warning', responseTime: '234ms', requests: 3421 },
    { name: '/api/analytics/trends', status: 'healthy', responseTime: '156ms', requests: 8765 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">API Health Monitoring</h1>
        <div className="flex gap-4">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(apiMetrics).map(([key, value]) => (
          <div key={key} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Chart */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Response Time Trends</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📈</div>
              <p>Response Time Chart</p>
              <p className="text-sm">Average: 142ms</p>
            </div>
          </div>
        </div>

        {/* Request Volume Chart */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Request Volume</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p>Request Volume Chart</p>
              <p className="text-sm">Peak: 2,847 req/min</p>
            </div>
          </div>
        </div>

        {/* Error Rate Chart */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Error Rate</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">⚠️</div>
              <p>Error Rate Chart</p>
              <p className="text-sm">Current: 0.03%</p>
            </div>
          </div>
        </div>

        {/* Uptime Chart */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">System Uptime</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">⏱️</div>
              <p>Uptime Chart</p>
              <p className="text-sm">99.97% uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Status */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Endpoint Health Status</h3>
        <div className="space-y-3">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(endpoint.status)}`}></div>
                <span className="text-white font-mono">{endpoint.name}</span>
              </div>
              <div className="flex gap-6 text-sm text-gray-400">
                <span>Response: {endpoint.responseTime}</span>
                <span>Requests: {endpoint.requests.toLocaleString()}</span>
                <span className="capitalize">{endpoint.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default APIHealthCharts;