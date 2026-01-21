import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { fetchAllMonitoringData } from '../../../api/monitoringApi';
import GoogleMap from '../../../components/GoogleMap';

const ActivityTrends = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [userType, setUserType] = useState('all');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userActivityData, setUserActivityData] = useState([]);
  const [featureUsageData, setFeatureUsageData] = useState([]);
  const [sessionData, setSessionData] = useState([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const monitoringData = await fetchAllMonitoringData();

      // Extract relevant data from the integrated response
      setStats(monitoringData.activityStats || {});
      setUserActivityData(monitoringData.chartData?.userActivity || []);
      setFeatureUsageData(monitoringData.chartData?.featureUsage || []);
      setSessionData(monitoringData.chartData?.sessionDuration || []);
    } catch (err) {
      console.error("Failed to fetch activity stats", err);
      // Fallback to mock data
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Generate user activity data for the last 7 days
    const activity = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      activity.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: Math.floor(Math.random() * 500) + 200,
        sessions: Math.floor(Math.random() * 800) + 300
      });
    }
    setUserActivityData(activity);

    // Generate feature usage data
    const features = [
      { name: 'Search', value: 35, color: '#3B82F6' },
      { name: 'Patent View', value: 25, color: '#10B981' },
      { name: 'Filing', value: 20, color: '#F59E0B' },
      { name: 'Analytics', value: 12, color: '#EF4444' },
      { name: 'Reports', value: 8, color: '#8B5CF6' }
    ];
    setFeatureUsageData(features);

    // Generate session duration data
    const sessions = [
      { duration: '0-5min', users: 120 },
      { duration: '5-15min', users: 280 },
      { duration: '15-30min', users: 190 },
      { duration: '30-60min', users: 150 },
      { duration: '60min+', users: 80 }
    ];
    setSessionData(sessions);
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  const activityStats = {
    totalUsers: stats ? stats.totalUsers : 0,
    activeUsers: stats ? stats.activeUsers : 0,
    newRegistrations: stats ? stats.newRegistrations : 0,
    searchQueries: stats ? stats.searchQueries : 0,
    patentViews: stats ? stats.patentViews : 0
  };

  const topActivities = stats && stats.topActivities ? stats.topActivities : [];

  const userSegments = [
    { segment: 'Individual Inventors', users: 1245, percentage: 43.7 },
    { segment: 'Law Firms', users: 892, percentage: 31.3 },
    { segment: 'R&D Teams', users: 456, percentage: 16.0 },
    { segment: 'Enterprises', users: 254, percentage: 8.9 }
  ];

  if (loading && !stats) return <div className="text-white">Loading activity trends...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">User Activity Trends</h1>
        <div className="flex gap-4">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <select value={userType} onChange={(e) => setUserType(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
            <option value="all">All Users</option>
            <option value="premium">Premium Users</option>
            <option value="free">Free Users</option>
          </select>
          <button
            onClick={fetchStats}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition flex items-center gap-2"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-white">{activityStats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active Users</p>
          <p className="text-2xl font-bold text-white">{activityStats.activeUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">New Registrations</p>
          <p className="text-2xl font-bold text-white">{activityStats.newRegistrations.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Search Queries</p>
          <p className="text-2xl font-bold text-white">{activityStats.searchQueries.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Patent Views</p>
          <p className="text-2xl font-bold text-white">{activityStats.patentViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Timeline */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Daily Active Users</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
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
                dataKey="users"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                name="Active Users"
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Sessions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Usage */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Feature Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={featureUsageData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {featureUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 h-[400px] flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-4">Geographic Distribution</h3>
          <div className="flex-1 min-h-0 w-full">
            <GoogleMap
              zoom={2}
              lat={20}
              lng={0}
              markers={[
                { lat: 40.7128, lng: -74.0060, title: "North America (High Activity)", info: "Active Users: 1,200" },
                { lat: 51.5074, lng: -0.1278, title: "Europe (Medium Activity)", info: "Active Users: 850" },
                { lat: 35.6762, lng: 139.6503, title: "Asia (High Activity)", info: "Active Users: 950" },
                { lat: 12.9716, lng: 77.5946, title: "India (Growth Region)", info: "Active Users: 600" },
                { lat: -33.8688, lng: 151.2093, title: "Australia (Emerging)", info: "Active Users: 150" },
                { lat: -23.5505, lng: -46.6333, title: "South America", info: "Active Users: 300" }
              ]}
            />
          </div>
        </div>

        {/* Session Duration */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Average Session Duration</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="duration" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="users" fill="#F59E0B" name="Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Activities Table */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Top User Activities</h3>
        {topActivities.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No activity data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-gray-400 py-3">Activity</th>
                  <th className="text-right text-gray-400 py-3">Count</th>
                  <th className="text-right text-gray-400 py-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topActivities.map((item, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="text-white py-3">{item.activity}</td>
                    <td className="text-right text-white py-3">{item.count.toLocaleString()}</td>
                    <td className={`text-right py-3 ${item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {item.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Segments */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">User Segments</h3>
        <div className="space-y-4">
          {userSegments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-blue-500 rounded" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
                <span className="text-white">{segment.segment}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400">{segment.users.toLocaleString()} users</span>
                <span className="text-white font-semibold">{segment.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityTrends;