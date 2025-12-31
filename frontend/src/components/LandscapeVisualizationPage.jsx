import React, { useState, useEffect } from 'react';
import {
  ScatterChart, Scatter, BarChart, Bar, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, Treemap
} from 'recharts';
import {
  TrendingUp, Users, Award, Zap, Target, Network,
  Filter, Download, RefreshCw, Search, Lightbulb,
  GitBranch, Globe, Layers, Eye, EyeOff
} from 'lucide-react';

// ============ DUMMY DATA ============
const DUMMY_DATA = {
  technologyLandscape: [],
  competitorAnalysis: [
    { assignee: 'Samsung Electronics', patentCount: 8542, activeCount: 6234, growth: 15.3 },
    { assignee: 'IBM Corporation', patentCount: 7891, activeCount: 5823, growth: 8.7 },
    { assignee: 'Canon Inc.', patentCount: 6754, activeCount: 4987, growth: -2.4 },
    { assignee: 'Google LLC', patentCount: 6123, activeCount: 5456, growth: 22.8 },
    { assignee: 'Microsoft Corp.', patentCount: 5890, activeCount: 5123, growth: 18.5 },
    { assignee: 'Intel Corporation', patentCount: 5234, activeCount: 4098, growth: 5.2 },
    { assignee: 'LG Electronics', patentCount: 4987, activeCount: 3876, growth: 12.4 },
    { assignee: 'Sony Corporation', patentCount: 4567, activeCount: 3456, growth: -5.6 },
    { assignee: 'Qualcomm Inc.', patentCount: 4234, activeCount: 3987, growth: 25.7 },
    { assignee: 'Apple Inc.', patentCount: 3987, activeCount: 3765, growth: 31.2 }
  ],
  innovationTrends: [
    { year: '2019', innovations: 1234, growthRate: 8.5 },
    { year: '2020', innovations: 1456, growthRate: 18.0 },
    { year: '2021', innovations: 1789, growthRate: 22.8 },
    { year: '2022', innovations: 2134, growthRate: 19.3 },
    { year: '2023', innovations: 2567, growthRate: 20.3 },
    { year: '2024', innovations: 3012, growthRate: 17.3 }
  ],
  convergenceMap: [
    { field1: 'AI/ML', field2: 'Healthcare', strength: 87, overlapCount: 1234 },
    { field1: 'IoT', field2: 'Smart Cities', strength: 82, overlapCount: 987 },
    { field1: 'Blockchain', field2: 'FinTech', strength: 78, overlapCount: 876 },
    { field1: '5G', field2: 'Autonomous Vehicles', strength: 75, overlapCount: 765 },
    { field1: 'Quantum Computing', field2: 'Cryptography', strength: 71, overlapCount: 654 },
    { field1: 'AR/VR', field2: 'Gaming', strength: 68, overlapCount: 543 },
    { field1: 'Robotics', field2: 'Manufacturing', strength: 65, overlapCount: 432 },
    { field1: 'Clean Energy', field2: 'Battery Tech', strength: 62, overlapCount: 321 }
  ],
  lifecycleAnalysis: {
    avgLifespan: 14.5,
    activePhase: 8.2,
    maturityRate: 68.4
  },
  classificationTrends: [
    { code: 'H04L', description: 'Transmission of Digital Information', count: 5678 },
    { code: 'G06F', description: 'Electric Digital Data Processing', count: 5234 },
    { code: 'H04W', description: 'Wireless Communication Networks', count: 4987 },
    { code: 'G06N', description: 'Computing Arrangements Based on AI', count: 4456 },
    { code: 'H04N', description: 'Pictorial Communication (Video)', count: 3987 },
    { code: 'G06Q', description: 'Data Processing for Business', count: 3654 },
    { code: 'G06T', description: 'Image Data Processing', count: 3234 },
    { code: 'H01L', description: 'Semiconductor Devices', count: 2987 },
    { code: 'G16H', description: 'Healthcare Informatics', count: 2765 },
    { code: 'B60W', description: 'Vehicle Control Systems', count: 2456 }
  ],
  topInventors: [
    { name: 'Dr. Sarah Chen', patentCount: 234, fields: ['AI/ML', 'Computer Vision'] },
    { name: 'Dr. Rajesh Kumar', patentCount: 198, fields: ['5G Networks', 'IoT'] },
    { name: 'Dr. Emily Watson', patentCount: 187, fields: ['Biotechnology', 'Pharmaceuticals'] },
    { name: 'Dr. James Park', patentCount: 176, fields: ['Semiconductors', 'Nanotechnology'] },
    { name: 'Dr. Maria Garcia', patentCount: 165, fields: ['Renewable Energy', 'Battery Tech'] },
    { name: 'Dr. Michael Zhang', patentCount: 154, fields: ['Robotics', 'Automation'] },
    { name: 'Dr. Anna Kowalski', patentCount: 143, fields: ['Medical Devices', 'Diagnostics'] },
    { name: 'Dr. Ahmed Hassan', patentCount: 132, fields: ['Blockchain', 'Cryptography'] },
    { name: 'Dr. Lisa Johnson', patentCount: 121, fields: ['AR/VR', 'Gaming'] }
  ]
};

// ============ CONSTANTS ============
const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#10b981',
  tertiary: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  warning: '#f59e0b',
  gray: '#6b7280'
};

const FIELD_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
];

const TECH_FIELDS = [
  { value: 'all', label: 'All Technologies' },
  { value: 'ai', label: 'AI/Machine Learning' },
  { value: 'biotech', label: 'Biotechnology' },
  { value: 'telecom', label: 'Telecommunications' },
  { value: 'semiconductor', label: 'Semiconductors' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'energy', label: 'Clean Energy' },
  { value: 'medical', label: 'Medical Devices' }
];

const CHART_MARGIN = { top: 20, right: 30, left: 20, bottom: 20 };
const CARTESIAN_GRID_CONFIG = { strokeDasharray: '3 3', stroke: '#e5e7eb' };
const TOOLTIP_CONFIG = { 
  contentStyle: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }
};
const LEGEND_CONFIG = { iconType: 'circle', wrapperStyle: { paddingTop: '10px' } };

// ============ UTILITY FUNCTIONS ============
const formatNumber = (num) => {
  if (!num) return '0';
  return num.toLocaleString();
};

const formatPercent = (num) => {
  if (!num && num !== 0) return 'N/A';
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
};

const getGrowthIndicator = (growth) => {
  if (growth > 15) return { symbol: '🚀', color: 'text-emerald-600', bgColor: 'bg-emerald-100' };
  if (growth > 5) return { symbol: '📈', color: 'text-green-600', bgColor: 'bg-green-100' };
  if (growth > -5) return { symbol: '➡️', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  return { symbol: '📉', color: 'text-red-600', bgColor: 'bg-red-100' };
};

const customTooltipFormatter = (value, name) => {
  if (typeof value === 'number') {
    return [formatNumber(value), name];
  }
  return [value, name];
};

// ============ MAIN COMPONENT ============
const LandscapeVisualizationPage = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('technology');
  const [selectedField, setSelectedField] = useState('all');
  const [selectedView, setSelectedView] = useState('matrix');
  const [topN, setTopN] = useState(10);
  const [landscapeData, setLandscapeData] = useState(DUMMY_DATA);

  // Simulate data fetching
  const fetchLandscapeData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Filter data based on topN
      const filteredData = {
        ...DUMMY_DATA,
        competitorAnalysis: DUMMY_DATA.competitorAnalysis.slice(0, topN),
        classificationTrends: DUMMY_DATA.classificationTrends.slice(0, topN),
        topInventors: DUMMY_DATA.topInventors.slice(0, topN)
      };

      setLandscapeData(filteredData);
    } catch (err) {
      console.error('Error fetching landscape data:', err);
      setError('Failed to load landscape visualization data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLandscapeData();
  }, [selectedField, topN]);

  // Export handlers
  const handleExportCompetitors = () => {
    const csv = [
      ['Assignee', 'Patent Count', 'Active Count', 'Growth (%)'],
      ...landscapeData.competitorAnalysis.map(c => [
        c.assignee, c.patentCount, c.activeCount, c.growth
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'competitor-analysis.csv';
    a.click();
  };

  const handleExportAllData = () => {
    const json = JSON.stringify(landscapeData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landscape-visualization-complete.json';
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading landscape analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md bg-white rounded-xl shadow-lg p-8">
          <Network className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Landscape</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchLandscapeData()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { competitorAnalysis, innovationTrends, classificationTrends, topInventors, convergenceMap, lifecycleAnalysis } = landscapeData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">IP Landscape Visualization</h1>
            <p className="text-gray-600">Advanced analytics for technology trends, competitors, and innovation patterns</p>
          </div>
          <button
            onClick={() => fetchLandscapeData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* FILTERS & TABS */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-400" />
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {TECH_FIELDS.map(field => (
                <option key={field.value} value={field.value}>{field.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-400" />
            <select
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
              <option value={50}>Top 50</option>
            </select>
          </div>

          <div className="ml-auto flex gap-2">
            <button
              onClick={handleExportCompetitors}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={handleExportAllData}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Download className="w-4 h-4" />
              JSON
            </button>
          </div>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: 'technology', label: 'Technology Map', icon: Zap },
            { id: 'competitors', label: 'Competitors', icon: Users },
            { id: 'innovation', label: 'Innovation', icon: Lightbulb },
            { id: 'convergence', label: 'Convergence', icon: GitBranch }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TECHNOLOGY TAB */}
      {activeTab === 'technology' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Classification Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={classificationTrends} layout="horizontal" margin={{ ...CHART_MARGIN, left: 20 }}>
                <CartesianGrid {...CARTESIAN_GRID_CONFIG} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="code" type="category" width={80} tick={{ fontSize: 10 }} />
                <Tooltip {...TOOLTIP_CONFIG} formatter={customTooltipFormatter} />
                <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[0, 8, 8, 0]} name="Patent Count">
                  {classificationTrends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={FIELD_COLORS[index % FIELD_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {classificationTrends.slice(0, 6).map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className="w-3 h-3 rounded-full mt-1"
                    style={{ backgroundColor: FIELD_COLORS[index % FIELD_COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900">{item.code}</span>
                      <span className="text-sm font-semibold text-indigo-600">{formatNumber(item.count)}</span>
                    </div>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMPETITORS TAB */}
      {activeTab === 'competitors' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Competitors Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={competitorAnalysis} margin={CHART_MARGIN}>
                <CartesianGrid {...CARTESIAN_GRID_CONFIG} />
                <XAxis dataKey="assignee" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip {...TOOLTIP_CONFIG} formatter={customTooltipFormatter} />
                <Legend {...LEGEND_CONFIG} />
                <Bar dataKey="patentCount" fill={CHART_COLORS.primary} name="Total Patents" radius={[8, 8, 0, 0]} />
                <Bar dataKey="activeCount" fill={CHART_COLORS.secondary} name="Active Patents" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Competitor Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assignee</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Patents</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Active</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Growth</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Market Share</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorAnalysis.map((comp, index) => {
                    const indicator = getGrowthIndicator(comp.growth);
                    const totalMarket = competitorAnalysis.reduce((sum, c) => sum + c.patentCount, 0);
                    const marketShare = ((comp.patentCount / totalMarket) * 100).toFixed(1);
                    
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{comp.assignee}</td>
                        <td className="text-right py-3 px-4 font-semibold text-gray-900">{formatNumber(comp.patentCount)}</td>
                        <td className="text-right py-3 px-4 text-emerald-600 font-semibold">{formatNumber(comp.activeCount)}</td>
                        <td className={`text-right py-3 px-4 font-semibold ${indicator.color}`}>
                          {formatPercent(comp.growth)}
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${marketShare}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-600">{marketShare}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Inventors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topInventors.slice(0, 9).map((inventor, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                  <div className="flex items-start justify-between mb-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-600">#{index + 1}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{inventor.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{formatNumber(inventor.patentCount)} patents</p>
                  <div className="flex flex-wrap gap-1">
                    {inventor.fields?.slice(0, 2).map((field, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-white rounded-full text-gray-700">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INNOVATION TAB */}
      {activeTab === 'innovation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Innovation Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={innovationTrends} margin={CHART_MARGIN}>
                <CartesianGrid {...CARTESIAN_GRID_CONFIG} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip {...TOOLTIP_CONFIG} />
                <Legend {...LEGEND_CONFIG} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="innovations"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  name="Innovations"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growthRate"
                  stroke={CHART_COLORS.secondary}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  name="Growth Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patent Lifecycle Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Average Lifespan</p>
                <p className="text-3xl font-bold text-indigo-600">{lifecycleAnalysis.avgLifespan} yrs</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Active Phase</p>
                <p className="text-3xl font-bold text-emerald-600">{lifecycleAnalysis.activePhase} yrs</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Maturity Rate</p>
                <p className="text-3xl font-bold text-amber-600">{lifecycleAnalysis.maturityRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONVERGENCE TAB */}
      {activeTab === 'convergence' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Convergence Network</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {convergenceMap.slice(0, 8).map((conv, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <GitBranch className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-semibold text-gray-500">Strength: {conv.strength}%</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{conv.field1}</span>
                    <span className="text-gray-400">↔</span>
                    <span className="font-semibold text-gray-900">{conv.field2}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${conv.strength}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-right">{formatNumber(conv.overlapCount)} overlap patents</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandscapeVisualizationPage;