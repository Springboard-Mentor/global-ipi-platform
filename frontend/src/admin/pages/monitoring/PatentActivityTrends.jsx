import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { fetchAllMonitoringData } from '../../../api/monitoringApi';

const PatentActivityTrends = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [category, setCategory] = useState('all');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filingTrends, setFilingTrends] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [jurisdictionData, setJurisdictionData] = useState([]);
  const [grantRateData, setGrantRateData] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const monitoringData = await fetchAllMonitoringData();

        // Extract patent trends data from the integrated response
        setData(monitoringData.patentTrends || {});
        setFilingTrends(monitoringData.chartData?.filingTrends || []);
        setCategoryData(monitoringData.chartData?.categories || []);
        setGrantRateData(monitoringData.chartData?.grantRates || []);
        setJurisdictionData(monitoringData.chartData?.jurisdictions || []);
      } catch (e) {
        console.error("Failed to load patent trends", e);
        // Fallback to mock data
        generateMockData();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange]); // Refresh when filter changes (future implementation)

  const generateMockData = () => {
    // Generate filing trends data
    const trends = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        filings: Math.floor(Math.random() * 200) + 100,
        grants: Math.floor(Math.random() * 150) + 50
      });
    }
    setFilingTrends(trends);

    // Generate category data
    const categories = [
      { name: 'AI & ML', value: 25, color: '#3B82F6' },
      { name: 'Biotech', value: 20, color: '#10B981' },
      { name: 'Renewable Energy', value: 18, color: '#F59E0B' },
      { name: 'Software', value: 15, color: '#EF4444' },
      { name: 'Hardware', value: 12, color: '#8B5CF6' },
      { name: 'Other', value: 10, color: '#6B7280' }
    ];
    setCategoryData(categories);

    // Generate jurisdiction data
    const jurisdictions = [
      { country: 'US', patents: 450, percentage: 35.2 },
      { country: 'CN', patents: 320, percentage: 25.0 },
      { country: 'JP', patents: 180, percentage: 14.1 },
      { country: 'EP', patents: 150, percentage: 11.7 },
      { country: 'KR', patents: 120, percentage: 9.4 },
      { country: 'Other', patents: 50, percentage: 3.9 }
    ];
    setJurisdictionData(jurisdictions);

    // Generate grant rate data
    const grantRates = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      grantRates.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        rate: Math.floor(Math.random() * 20) + 60 // 60-80% grant rate
      });
    }
    setGrantRateData(grantRates);
  };

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
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
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
                dataKey="filings"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                name="Filings"
              />
              <Line
                type="monotone"
                dataKey="grants"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Grants"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Patent Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
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
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Filing by Jurisdiction</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={jurisdictionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="country" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="patents" fill="#F59E0B" name="Patents" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grant Rate Analysis */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Grant Rate Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={grantRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[50, 90]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value) => [`${value}%`, 'Grant Rate']}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                name="Grant Rate"
              />
            </LineChart>
          </ResponsiveContainer>
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