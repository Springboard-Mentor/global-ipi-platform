import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActivityTrends = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [userType, setUserType] = useState('all');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:8081/api/admin/monitoring/activity", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch activity stats", err);
    } finally {
      setLoading(false);
    }
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
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">👥</div>
              <p>User Activity Timeline</p>
              <p className="text-sm">Active: {activityStats.activeUsers}</p>
            </div>
          </div>
        </div>

        {/* Feature Usage */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Feature Usage Distribution</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🔧</div>
              <p>Top Feature: Search ({activityStats.searchQueries})</p>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Geographic Distribution</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🌍</div>
              <p>World Map View</p>
              <p className="text-sm">Top region: Global</p>
            </div>
          </div>
        </div>

        {/* Session Duration */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Average Session Duration</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">⏰</div>
              <p>Session Duration Chart</p>
              <p className="text-sm">Average: ~15 minutes</p>
            </div>
          </div>
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