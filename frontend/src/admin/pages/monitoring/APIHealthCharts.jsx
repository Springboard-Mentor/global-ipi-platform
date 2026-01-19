import React, { useState, useEffect } from 'react';
import axios from 'axios';

const APIHealthCharts = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:8081/api/admin/monitoring/health";

  const fetchHealthStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch health stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStats();
    const interval = setInterval(fetchHealthStats, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading && !stats) return <div className="text-white">Loading system vitals...</div>;

  // Use stats if available, else defaults
  const metrics = stats ? {
    uptime: stats.uptime,
    responseTime: stats.responseTimeMs ? `${stats.responseTimeMs.toFixed(0)} ms` : '0 ms',
    requestsPerMinute: stats.requestsPerMinute,
    errorRate: stats.errorRatePercent ? `${stats.errorRatePercent.toFixed(2)}%` : '0%',
    totalRequests: stats.totalRequests.toLocaleString()
  } : {};

  const endpoints = stats && stats.endpoints ? Object.values(stats.endpoints) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">API Health Monitoring</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live System Data
          </div>
          <button
            onClick={fetchHealthStats}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition flex items-center gap-2"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">System Uptime</p>
          <p className="text-2xl font-bold text-white text-nowrap">{metrics.uptime}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Avg Response Time</p>
          <p className="text-2xl font-bold text-white">{metrics.responseTime}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Requests / Minute</p>
          <p className="text-2xl font-bold text-white">{metrics.requestsPerMinute}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Error Rate</p>
          <p className="text-2xl font-bold text-white">{metrics.errorRate}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Requests</p>
          <p className="text-2xl font-bold text-white">{metrics.totalRequests}</p>
        </div>
      </div>

      {/* Charts Grid - Placeholder for Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Live Traffic Load</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p>Requests processed since startup: {metrics.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Response Performance</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">⚡</div>
              <p>Avg Latency: {metrics.responseTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Status */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Active Endpoints Health</h3>
        <div className="space-y-3">
          {endpoints.length === 0 ? (
            <div className="text-gray-400 text-center py-4">No traffic recorded yet. Make some API calls to see data.</div>
          ) : (
            endpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(endpoint.status)}`}></div>
                  <span className="text-white font-mono">{endpoint.path}</span>
                </div>
                <div className="flex gap-6 text-sm text-gray-400">
                  <span>Avg: {endpoint.averageResponseTime?.toFixed(0)}ms</span>
                  <span>Reqs: {endpoint.requestCount}</span>
                  <span>Errs: {endpoint.errorCount}</span>
                  <span className="capitalize px-2 py-0.5 rounded bg-white/5">{endpoint.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default APIHealthCharts;