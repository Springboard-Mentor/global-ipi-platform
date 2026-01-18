import React, { useState } from 'react';

const ActivityTrends = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [userType, setUserType] = useState('all');

  const activityStats = {
    totalUsers: 2847,
    activeUsers: 1923,
    newRegistrations: 156,
    searchQueries: 45678,
    patentViews: 23456
  };

  const topActivities = [
    { activity: 'Patent Search', count: 15234, trend: '+12%' },
    { activity: 'User Registration', count: 856, trend: '+8%' },
    { activity: 'Profile Updates', count: 432, trend: '-3%' },
    { activity: 'Subscription Changes', count: 234, trend: '+15%' },
    { activity: 'Filing Submissions', count: 123, trend: '+22%' }
  ];

  const userSegments = [
    { segment: 'Individual Inventors', users: 1245, percentage: 43.7 },
    { segment: 'Law Firms', users: 892, percentage: 31.3 },
    { segment: 'R&D Teams', users: 456, percentage: 16.0 },
    { segment: 'Enterprises', users: 254, percentage: 8.9 }
  ];

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
        </div>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(activityStats).map(([key, value]) => (
          <div key={key} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
          </div>
        ))}
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
              <p className="text-sm">Peak: 1,923 users</p>
            </div>
          </div>
        </div>

        {/* Feature Usage */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Feature Usage Distribution</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🔧</div>
              <p>Feature Usage Chart</p>
              <p className="text-sm">Most used: Patent Search</p>
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
              <p className="text-sm">Top region: North America</p>
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
              <p className="text-sm">Average: 24 minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Activities Table */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Top User Activities</h3>
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
      </div>

      {/* User Segments */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">User Segments</h3>
        <div className="space-y-4">
          {userSegments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-blue-500 rounded" style={{backgroundColor: `hsl(${index * 60}, 70%, 50%)`}}></div>
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