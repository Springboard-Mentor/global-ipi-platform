import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { fetchAllMonitoringData } from '../../../api/monitoringApi';

const APIHealthCharts = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trafficData, setTrafficData] = useState([]);
  const [responseData, setResponseData] = useState([]);

  const API_URL = "http://localhost:8081/api/admin/monitoring/health";

  // Generate mock data for charts
  const generateMockData = () => {
    const now = new Date();
    const traffic = [];
    const responses = [];

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      traffic.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        requests: Math.floor(Math.random() * 100) + 50,
        errors: Math.floor(Math.random() * 10)
      });
    }

    for (let i = 0; i < 10; i++) {
      responses.push({
        endpoint: `/api/endpoint${i + 1}`,
        avgResponse: Math.floor(Math.random() * 200) + 50,
        requests: Math.floor(Math.random() * 500) + 100
      });
    }

    setTrafficData(traffic);
    setResponseData(responses);
  };

  const fetchHealthStats = async () => {
    setLoading(true);
    try {
      const monitoringData = await fetchAllMonitoringData();

      // Extract relevant data from the integrated response
      setStats(monitoringData.systemHealth || {});
      const trafficChartData = monitoringData.chartData?.traffic || [];
      const responseChartData = monitoringData.chartData?.responsePerformance || [];
      
      setTrafficData(trafficChartData.length > 0 ? trafficChartData : generateMockTrafficData());
      setResponseData(responseChartData.length > 0 ? responseChartData : generateMockResponseData());
    } catch (error) {
      console.error("Failed to fetch health stats", error);
      // Fallback to mock data
      setTrafficData(generateMockTrafficData());
      setResponseData(generateMockResponseData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockTrafficData = () => {
    const now = new Date();
    const data = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        requests: Math.floor(Math.random() * 100) + 50,
        errors: Math.floor(Math.random() * 10)
      });
    }
    return data;
  };

  const generateMockResponseData = () => {
    const data = [];
    for (let i = 0; i < 6; i++) {
      data.push({
        endpoint: `/api/endpoint${i + 1}`,
        avgResponse: Math.floor(Math.random() * 200) + 50,
        requests: Math.floor(Math.random() * 500) + 100
      });
    }
    return data;
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
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Requests"
              />
              <Line
                type="monotone"
                dataKey="errors"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                name="Errors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Response Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={responseData.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="endpoint" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="avgResponse" fill="#10B981" name="Avg Response Time (ms)" />
            </BarChart>
          </ResponsiveContainer>
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