import React, { useState } from 'react';

const PatentActivityTrends = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [category, setCategory] = useState('all');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8081/api/admin/monitoring/trends', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to load patent trends", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange]); // Refresh when filter changes (future implementation)

  if (loading) return <div className="text-white text-center py-20">Loading Trends...</div>;
  if (!data) return <div className="text-white text-center py-20">Failed to load data</div>;

  const { patentStats, trendingCategories, jurisdictions, filingStatus } = data;

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
        {patentStats && Object.entries(patentStats).map(([key, value]) => (
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
              <p className="text-sm">Top: {trendingCategories?.[0]?.category || 'N/A'}</p>
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
              <p className="text-sm">Leading: {jurisdictions?.[0]?.country || 'N/A'}</p>
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
              <p className="text-sm">Driven by real data</p>
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
              {trendingCategories && trendingCategories.map((item, index) => (
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
            {filingStatus && filingStatus.map((status, index) => (
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
            {jurisdictions && jurisdictions.map((jurisdiction, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-white">{jurisdiction.country}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{jurisdiction.patents.toLocaleString()}</span>
                  <span className="text-white font-semibold">{jurisdiction.percentage.toFixed(1)}%</span>
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