import React, { useState } from 'react';

const PatentActivityTrends = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [category, setCategory] = useState('all');

  const patentStats = {
    totalPatents: 15234,
    newFilings: 456,
    grantedPatents: 234,
    pendingApplications: 1892,
    rejectedApplications: 89
  };

  const trendingCategories = [
    { category: 'Artificial Intelligence', patents: 2847, growth: '+45%' },
    { category: 'Biotechnology', patents: 1923, growth: '+32%' },
    { category: 'Renewable Energy', patents: 1456, growth: '+28%' },
    { category: 'Medical Devices', patents: 1234, growth: '+18%' },
    { category: 'Automotive', patents: 987, growth: '+12%' }
  ];

  const jurisdictions = [
    { country: 'United States', patents: 5678, percentage: 37.3 },
    { country: 'China', patents: 3456, percentage: 22.7 },
    { country: 'European Union', patents: 2345, percentage: 15.4 },
    { country: 'Japan', patents: 1789, percentage: 11.7 },
    { country: 'Others', patents: 1966, percentage: 12.9 }
  ];

  const filingStatus = [
    { status: 'Published', count: 8945, color: 'bg-blue-500' },
    { status: 'Granted', count: 3456, color: 'bg-green-500' },
    { status: 'Pending', count: 2134, color: 'bg-yellow-500' },
    { status: 'Rejected', count: 699, color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Patent Activity Trends</h1>
        <div className="flex gap-4">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
            <option value="all">All Categories</option>
            <option value="ai">Artificial Intelligence</option>
            <option value="biotech">Biotechnology</option>
            <option value="energy">Renewable Energy</option>
          </select>
        </div>
      </div>

      {/* Patent Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(patentStats).map(([key, value]) => (
          <div key={key} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filing Trends */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Monthly Filing Trends</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📈</div>
              <p>Filing Trends Chart</p>
              <p className="text-sm">+23% this month</p>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Patent Categories</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🥧</div>
              <p>Category Distribution</p>
              <p className="text-sm">Top: AI & Machine Learning</p>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Filing by Jurisdiction</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🗺️</div>
              <p>Jurisdiction Map</p>
              <p className="text-sm">Leading: United States</p>
            </div>
          </div>
        </div>

        {/* Grant Rate Analysis */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Grant Rate Analysis</h3>
          <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">✅</div>
              <p>Grant Rate Chart</p>
              <p className="text-sm">Average: 72.3%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Categories */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Trending Patent Categories</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-gray-400 py-3">Category</th>
                <th className="text-right text-gray-400 py-3">Patents</th>
                <th className="text-right text-gray-400 py-3">Growth</th>
              </tr>
            </thead>
            <tbody>
              {trendingCategories.map((item, index) => (
                <tr key={index} className="border-b border-white/10">
                  <td className="text-white py-3">{item.category}</td>
                  <td className="text-right text-white py-3">{item.patents.toLocaleString()}</td>
                  <td className="text-right text-green-400 py-3">{item.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filing Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Filing Status Distribution</h3>
          <div className="space-y-4">
            {filingStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${status.color}`}></div>
                  <span className="text-white">{status.status}</span>
                </div>
                <span className="text-gray-400">{status.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Top Jurisdictions</h3>
          <div className="space-y-4">
            {jurisdictions.map((jurisdiction, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-white">{jurisdiction.country}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{jurisdiction.patents.toLocaleString()}</span>
                  <span className="text-white font-semibold">{jurisdiction.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentActivityTrends;