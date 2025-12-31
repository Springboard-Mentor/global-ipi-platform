// FILE LOCATION: frontend/src/components/LegalDashboardPage.jsx
// Production-ready Legal Status Dashboard with DUMMY DATA for UI Testing

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, ComposedChart
} from 'recharts';
import {
  TrendingUp, TrendingDown, FileText, AlertCircle,
  CheckCircle, Clock, Filter, Download, RefreshCw,
  Calendar, Briefcase, Award, AlertTriangle, BarChart3,
  Globe, Users, Target, Activity
} from 'lucide-react';

// API & Utilities
// Note: Imports kept for future backend integration
import analyticsAPI from '../api/analytics';
import {
  CHART_COLORS, STATUS_COLORS, FIELD_COLORS,
  formatNumber, formatPercent, getGrowthIndicator,
  customTooltipFormatter, CHART_CONFIG, // Fixed import name from CHART_MARGIN to CHART_CONFIG
  TOOLTIP_CONFIG, DATE_RANGES, IP_TYPES, JURISDICTIONS
} from '../utils/chartHelpers';
import { exportToCSV, exportToJSON, exportFieldTrendsToCSV } from '../utils/exportHelpers';

const LegalDashboardPage = () => {
  // ============ STATE MANAGEMENT ============
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filter States
  const [dateRange, setDateRange] = useState('year');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all');

  // Data States
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalFilings: 0,
      activePatents: 0,
      pendingApplications: 0,
      expiringSoon: 0
    },
    statusDistribution: [],
    filingsTrend: [],
    fieldWiseTrends: [],
    jurisdictionBreakdown: [],
    statusTimeline: []
  });

  // ============ DATA FETCHING (MOCK MODE) ============
  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    // SIMULATED API CALL (Replace with real API calls later)
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // DUMMY DATA OBJECT
      const mockData = {
        summary: {
          totalFilings: 1245,
          activePatents: 856,
          pendingApplications: 234,
          expiringSoon: 42
        },
        statusDistribution: [
          { name: 'Active', value: 856, color: STATUS_COLORS.ACTIVE },
          { name: 'Pending', value: 234, color: STATUS_COLORS.PENDING },
          { name: 'Expired', value: 89, color: STATUS_COLORS.EXPIRED },
          { name: 'Abandoned', value: 66, color: STATUS_COLORS.ABANDONED }
        ],
        filingsTrend: [
          { month: 'Jan', patents: 45, trademarks: 23 },
          { month: 'Feb', patents: 52, trademarks: 28 },
          { month: 'Mar', patents: 48, trademarks: 31 },
          { month: 'Apr', patents: 61, trademarks: 25 },
          { month: 'May', patents: 55, trademarks: 29 },
          { month: 'Jun', patents: 58, trademarks: 34 },
          { month: 'Jul', patents: 64, trademarks: 27 },
          { month: 'Aug', patents: 59, trademarks: 32 },
          { month: 'Sep', patents: 67, trademarks: 30 },
          { month: 'Oct', patents: 71, trademarks: 35 },
          { month: 'Nov', patents: 68, trademarks: 31 },
          { month: 'Dec', patents: 72, trademarks: 38 }
        ],
        fieldWiseTrends: [
          { field: 'AI & Machine Learning', count: 342, growth: 12.5 },
          { field: 'Pharmaceuticals', count: 289, growth: 8.3 },
          { field: 'Biotechnology', count: 178, growth: 15.7 },
          { field: 'Electronics', count: 156, growth: 6.2 },
          { field: 'Mechanical Engineering', count: 134, growth: -2.1 },
          { field: 'Chemical', count: 98, growth: 4.8 },
          { field: 'Software', count: 50, growth: 22.3 }
        ],
        jurisdictionBreakdown: [
          { jurisdiction: 'US', patents: 458, trademarks: 189 },
          { jurisdiction: 'EP', patents: 234, trademarks: 98 },
          { jurisdiction: 'CN', patents: 189, trademarks: 156 },
          { jurisdiction: 'IN', patents: 145, trademarks: 67 },
          { jurisdiction: 'JP', patents: 98, trademarks: 45 }
        ],
        statusTimeline: [
          { quarter: 'Q1 2024', filed: 145, granted: 89, rejected: 12, abandoned: 8 },
          { quarter: 'Q2 2024', filed: 167, granted: 95, rejected: 15, abandoned: 6 },
          { quarter: 'Q3 2024', filed: 189, granted: 103, rejected: 18, abandoned: 9 },
          { quarter: 'Q4 2024', filed: 201, granted: 112, rejected: 14, abandoned: 7 }
        ]
      };

      setDashboardData(mockData);

      /* UNCOMMENT THIS BLOCK FOR REAL API CALLS
      const params = {
        dateRange,
        type: selectedType,
        jurisdiction: selectedJurisdiction
      };

      const [
        summary,
        statusDist,
        filingsTrend,
        fieldTrends,
        jurisdictionData,
        timeline
      ] = await Promise.all([
        analyticsAPI.getDashboardSummary(params),
        analyticsAPI.getStatusDistribution(params),
        analyticsAPI.getFilingsTrend(params),
        analyticsAPI.getFieldWiseTrends(params),
        analyticsAPI.getJurisdictionBreakdown(params),
        analyticsAPI.getStatusTimeline(params)
      ]);

      setDashboardData({
        summary,
        statusDistribution: statusDist,
        filingsTrend,
        fieldWiseTrends: fieldTrends,
        jurisdictionBreakdown: jurisdictionData,
        statusTimeline: timeline
      });
      */

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, selectedType, selectedJurisdiction]);

  // ============ EXPORT HANDLERS ============
  const handleExportFieldTrends = () => {
    if (exportFieldTrendsToCSV) exportFieldTrendsToCSV(dashboardData.fieldWiseTrends);
  };

  const handleExportAllData = () => {
    if (exportToJSON) exportToJSON(dashboardData, 'legal-dashboard-complete');
  };

  const handleExportSummary = () => {
    const summaryData = [
      { metric: 'Total Filings', value: dashboardData.summary.totalFilings },
      { metric: 'Active Patents', value: dashboardData.summary.activePatents },
      { metric: 'Pending Applications', value: dashboardData.summary.pendingApplications },
      { metric: 'Expiring Soon', value: dashboardData.summary.expiringSoon }
    ];
    if (exportToCSV) exportToCSV(summaryData, 'dashboard-summary', ['Metric', 'Value']);
  };

  // ============ LOADING STATE ============
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  // ============ ERROR STATE ============
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md bg-white rounded-xl shadow-lg p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, statusDistribution, filingsTrend, fieldWiseTrends, jurisdictionBreakdown, statusTimeline } = dashboardData;

  // Use config from helpers if available, or fallbacks
  const marginConfig = CHART_CONFIG?.margin || { top: 10, right: 30, left: 0, bottom: 0 };
  const gridConfig = CHART_CONFIG?.cartesianGrid || { strokeDasharray: '3 3', stroke: '#E5E7EB' };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ============ HEADER SECTION ============ */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Status Dashboard</h1>
            <p className="text-gray-600">Comprehensive analytics for IP filings, trends, and status tracking</p>
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ============ FILTERS BAR ============ */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {DATE_RANGES?.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              )) || <option value="year">Past Year</option>}
            </select>
          </div>

          {/* IP Type Filter */}
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {IP_TYPES?.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              )) || <option value="all">All Types</option>}
            </select>
          </div>

          {/* Jurisdiction Filter */}
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-400" />
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {JURISDICTIONS?.map(juris => (
                <option key={juris.value} value={juris.value}>
                  {juris.flag} {juris.label}
                </option>
              )) || <option value="all">All Jurisdictions</option>}
            </select>
          </div>

          {/* Export Buttons */}
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleExportSummary}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              title="Export Summary"
            >
              <Download className="w-4 h-4" />
              Summary
            </button>
            <button
              onClick={handleExportFieldTrends}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              title="Export Field Trends"
            >
              <Download className="w-4 h-4" />
              Trends CSV
            </button>
            <button
              onClick={handleExportAllData}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              title="Export All Data"
            >
              <Download className="w-4 h-4" />
              Full JSON
            </button>
          </div>
        </div>
      </div>

      {/* ============ SUMMARY CARDS ============ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Filings Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Filings</h3>
            <FileText className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(summary.totalFilings)}</p>
          <p className="text-sm text-gray-500">All time records</p>
        </div>

        {/* Active Patents Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Active Patents</h3>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(summary.activePatents)}</p>
          <p className="text-sm text-emerald-600 font-medium">
            {summary.totalFilings > 0 ? ((summary.activePatents / summary.totalFilings) * 100).toFixed(1) : 0}% of total
          </p>
        </div>

        {/* Pending Applications Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pending Applications</h3>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(summary.pendingApplications)}</p>
          <p className="text-sm text-amber-600 font-medium">Under review</p>
        </div>

        {/* Expiring Soon Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Expiring Soon</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(summary.expiringSoon)}</p>
          <p className="text-sm text-red-600 font-medium">Next 90 days</p>
        </div>
      </div>

      {/* ============ MAIN CHARTS GRID ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* STATUS DISTRIBUTION PIE CHART */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip formatter={customTooltipFormatter} {...TOOLTIP_CONFIG} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color || STATUS_COLORS[item.name] }}
                />
                <span className="text-sm text-gray-700 font-medium">{item.name}:</span>
                <span className="text-sm text-gray-900 font-semibold">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FILINGS TREND AREA CHART */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filing Trends (Monthly)</h3>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={filingsTrend} margin={marginConfig}>
              <CartesianGrid {...gridConfig} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip {...TOOLTIP_CONFIG} formatter={customTooltipFormatter} />
              <Legend />
              <Area
                type="monotone"
                dataKey="patents"
                stackId="1"
                stroke={CHART_COLORS.primary}
                fill={CHART_COLORS.primary}
                fillOpacity={0.6}
                name="Patents"
              />
              <Area
                type="monotone"
                dataKey="trademarks"
                stackId="1"
                stroke={CHART_COLORS.secondary}
                fill={CHART_COLORS.secondary}
                fillOpacity={0.6}
                name="Trademarks"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ============ FIELD-WISE TRENDS TABLE ============ */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Field-wise Trends & Growth</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Field</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Count</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Growth</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Trend</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {fieldWiseTrends.map((field, index) => {
                const indicator = getGrowthIndicator(field.growth);
                const percentage = summary.totalFilings > 0 
                  ? ((field.count / summary.totalFilings) * 100).toFixed(1) 
                  : 0;
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: FIELD_COLORS[index % FIELD_COLORS.length] }}
                        />
                        <span className="font-medium text-gray-900">{field.field}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 font-semibold">
                      {formatNumber(field.count)}
                    </td>
                    <td className={`text-right py-3 px-4 font-semibold ${indicator.color}`}>
                      {formatPercent(field.growth)}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xl ${indicator.bgColor}`}>
                        {indicator.symbol}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600 font-medium">
                      {percentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============ JURISDICTION & STATUS TIMELINE ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* JURISDICTION BREAKDOWN BAR CHART */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Jurisdiction Breakdown</h3>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jurisdictionBreakdown} margin={marginConfig}>
              <CartesianGrid {...gridConfig} />
              <XAxis dataKey="jurisdiction" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip {...TOOLTIP_CONFIG} formatter={customTooltipFormatter} />
              <Legend />
              <Bar dataKey="patents" fill={CHART_COLORS.primary} name="Patents" radius={[8, 8, 0, 0]} />
              <Bar dataKey="trademarks" fill={CHART_COLORS.secondary} name="Trademarks" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* STATUS TIMELINE STACKED AREA CHART */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Status Timeline (Quarterly)</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={statusTimeline} margin={marginConfig}>
              <CartesianGrid {...gridConfig} />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip {...TOOLTIP_CONFIG} formatter={customTooltipFormatter} />
              <Legend />
              <Area
                type="monotone"
                dataKey="filed"
                stackId="1"
                stroke={CHART_COLORS.info}
                fill={CHART_COLORS.info}
                fillOpacity={0.7}
                name="Filed"
              />
              <Area
                type="monotone"
                dataKey="granted"
                stackId="1"
                stroke={CHART_COLORS.secondary}
                fill={CHART_COLORS.secondary}
                fillOpacity={0.7}
                name="Granted"
              />
              <Area
                type="monotone"
                dataKey="rejected"
                stackId="1"
                stroke={CHART_COLORS.danger}
                fill={CHART_COLORS.danger}
                fillOpacity={0.7}
                name="Rejected"
              />
              <Area
                type="monotone"
                dataKey="abandoned"
                stackId="1"
                stroke={CHART_COLORS.gray}
                fill={CHART_COLORS.gray}
                fillOpacity={0.7}
                name="Abandoned"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ============ INSIGHTS & RECOMMENDATIONS ============ */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <Award className="w-8 h-8 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold mb-2">Key Insights</h3>
            <ul className="space-y-2 text-white/90">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>You have <strong>{formatNumber(summary.activePatents)}</strong> active patents representing <strong>{summary.totalFilings > 0 ? ((summary.activePatents / summary.totalFilings) * 100).toFixed(1) : 0}%</strong> of your total portfolio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span><strong>{formatNumber(summary.pendingApplications)}</strong> applications are currently pending review</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span className="text-yellow-200 font-semibold">⚠️ {formatNumber(summary.expiringSoon)} patents will expire in the next 90 days - consider renewal actions</span>
              </li>
              {fieldWiseTrends[0] && (
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span><strong>{fieldWiseTrends[0].field}</strong> is your top field with <strong>{formatNumber(fieldWiseTrends[0].count)}</strong> filings and <strong>{formatPercent(fieldWiseTrends[0].growth)}</strong> growth</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ============ FOOTER INFO ============ */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <p className="mt-1">
          Data shown for: {DATE_RANGES?.find(r => r.value === dateRange)?.label || 'Past Year'} | {IP_TYPES?.find(t => t.value === selectedType)?.label || 'All Types'}
        </p>
      </div>
    </div>
  );
};

export default LegalDashboardPage;