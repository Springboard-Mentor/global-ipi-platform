import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from "recharts";
import {
  Loader2, TrendingUp, Activity, Globe, Shield, FileText, MapPin, AlertCircle
} from "lucide-react";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6", "#EC4899", "#06B6D4"];

const AnalysisPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDB = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/search/analysis");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setData(res.data);
        } else {
          setError("No portfolio data available");
        }
      } catch (err) {
        setError("Failed to connect to backend");
      } finally {
        setLoading(false);
      }
    };
    fetchDB();
  }, []);

  const stats = useMemo(() => {
    if (!data.length) return null;

    const typeCount = {};
    const regionCount = {};
    const yearCount = {};

    data.forEach(item => {
      const type = item.type || "Unknown";
      const region = item.jurisdiction || "Unknown";
      let year = "Unknown";
      if (item.year) year = item.year;
      else if (item.filingDate) year = new Date(item.filingDate).getFullYear();
      else if (item.createdDate) year = new Date(item.createdDate).getFullYear();

      typeCount[type] = (typeCount[type] || 0) + 1;
      regionCount[region] = (regionCount[region] || 0) + 1;
      yearCount[year] = (yearCount[year] || 0) + 1;
    });

    const pieData = Object.entries(typeCount).map(([k, v]) => ({ name: k, value: v }));
    const barData = Object.entries(regionCount).map(([k, v]) => ({ name: k, count: v }));
    const lineData = Object.entries(yearCount)
      .sort((a, b) => a[0] - b[0])
      .map(([year, count]) => ({ year, count }));

    const topType = pieData.sort((a, b) => b.value - a.value)[0];
    const topRegion = barData.sort((a, b) => b.count - a.count)[0];

    let growthRate = 0;
    if (lineData.length > 1) {
      const last = lineData[lineData.length - 1].count;
      const prev = lineData[lineData.length - 2].count;
      growthRate = (((last - prev) / prev) * 100).toFixed(1);
    }

    return { pieData, barData, lineData, topType, topRegion, growthRate };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
          <p className="text-lg font-semibold text-slate-700">Analyzing Portfolio</p>
          <p className="text-sm text-slate-500">Loading intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !data.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">No Data Available</h2>
          <p className="text-slate-600 text-sm">
            {error || "No portfolio data found. Please add IP assets to view analytics."}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        <div className="text-center space-y-4 pb-6">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Portfolio Intelligence
              </h1>
              <p className="text-indigo-600 text-sm font-medium mt-2">Live Analytics Dashboard</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 w-fit mx-auto bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-700">Real-Time Data Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KPICard
            title="Total Assets"
            value={data.length}
            icon={<FileText className="w-6 h-6" />}
            color="blue"
            subtitle="IP portfolio size"
          />
          <KPICard
            title="Top Category"
            value={stats.topType?.name || "N/A"}
            icon={<Activity className="w-6 h-6" />}
            color="purple"
            subtitle={`${stats.topType?.value || 0} assets`}
          />
          <KPICard
            title="Top Region"
            value={stats.topRegion?.name || "N/A"}
            icon={<Globe className="w-6 h-6" />}
            color="emerald"
            subtitle={`${stats.topRegion?.count || 0} filings`}
          />
          <KPICard
            title="Growth Rate"
            value={`${stats.growthRate}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="orange"
            subtitle="Year over year"
          />
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-200 font-semibold text-xs mb-3 flex items-center gap-2">
              <Shield size={14} /> Portfolio Analytics Engine
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6">
              Strategic IP Intelligence Dashboard
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-xl">
                <span className="text-xs font-medium text-indigo-200 block mb-1">Active Portfolio</span>
                <span className="text-2xl font-bold">{data.length} Assets</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-xl">
                <span className="text-xs font-medium text-emerald-200 block mb-1">Coverage</span>
                <span className="text-2xl font-bold">{stats.barData.length} Regions</span>
              </div>
            </div>
          </div>
          <Globe className="absolute -right-16 -bottom-16 w-64 h-64 sm:w-80 sm:h-80 text-indigo-400 opacity-5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <ChartCard 
            title="Portfolio Composition" 
            subtitle="Distribution by IP type"
            icon={<Activity className="w-5 h-5 text-indigo-600" />}
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stats.pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '11px' }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard 
            title="Jurisdiction Distribution" 
            subtitle="Assets by geographic region"
            icon={<MapPin className="w-5 h-5 text-purple-600" />}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '11px', fontWeight: '500' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '11px', fontWeight: '500' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                  cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                />
                <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard 
          title="Filing Trends Over Time" 
          subtitle="Yearly portfolio growth trajectory"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          fullWidth
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.lineData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: '11px', fontWeight: '500' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '11px', fontWeight: '500' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              />
              <Area type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl">
          <p className="text-indigo-300 text-xs font-semibold mb-6 text-center">Portfolio Performance Metrics</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-white">
            <div className="text-center p-5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-3xl font-bold mb-1">{data.length}</div>
              <div className="text-indigo-200 text-xs font-medium">Total Assets</div>
            </div>
            <div className="text-center p-5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-3xl font-bold mb-1">{stats.pieData.length}</div>
              <div className="text-indigo-200 text-xs font-medium">Asset Types</div>
            </div>
            <div className="text-center p-5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-3xl font-bold mb-1">{stats.barData.length}</div>
              <div className="text-indigo-200 text-xs font-medium">Jurisdictions</div>
            </div>
            <div className="text-center p-5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-3xl font-bold mb-1 flex items-center justify-center gap-1">
                {stats.growthRate}%
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-emerald-200 text-xs font-medium">YoY Growth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon, color, subtitle }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', hover: 'hover:shadow-md' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', hover: 'hover:shadow-md' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', hover: 'hover:shadow-md' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', hover: 'hover:shadow-md' }
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${colors.hover} transition-all p-6`}>
      <div className={`p-3 rounded-xl w-fit mb-4 ${colors.bg}`}>
        <div className={colors.icon}>{icon}</div>
      </div>
      <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
};

const ChartCard = ({ title, subtitle, icon, children, fullWidth }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 ${fullWidth ? 'lg:col-span-2' : ''}`}>
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>
      {subtitle && <p className="text-sm text-slate-600 ml-10">{subtitle}</p>}
    </div>
    <div>{children}</div>
  </div>
);

export default AnalysisPage;