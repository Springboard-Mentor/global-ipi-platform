import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Shield, CheckCircle, Clock, AlertCircle, TrendingUp, Download, Eye, Search } from 'lucide-react';
import { analyticsAPI } from "../api/analytics";
import { ipAssetAPI } from "../api/ipAssets";
import { FIELD_COLORS, STATUS_COLORS, CHART_CONFIG, formatNumber } from "../utils/chartHelpers.jsx";

const LegalDashboardPage = () => {
  const [data, setData] = useState({ summary: {}, distribution: [], timeline: [] });
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [stats, dist, trends, assets] = await Promise.all([
          analyticsAPI.getDashboardSummary(),
          analyticsAPI.getStatusDistribution(),
          analyticsAPI.getInnovationData(),
          ipAssetAPI.getAssets({ size: 10 })
        ]);
        setData({ summary: stats, distribution: dist, timeline: trends });
        setTableData(assets.content || []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-indigo-600 font-black uppercase tracking-widest text-xs">Syncing Legal Portfolio...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-10 bg-[#F8FAFC] min-h-screen text-left animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Legal Status Dashboard</h1>
          <p className="text-indigo-500 text-[10px] font-black tracking-[0.4em] uppercase mt-2">Monitoring & Compliance Node</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">
          <Download size={16} /> Download Report
        </button>
      </div>

      {/* KPI OVERVIEW SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard label="Total Filings" value={data.summary.totalFilings} icon={Shield} color="bg-indigo-600" />
        <StatCard label="Active/Pending" value={data.summary.pendingApplications} icon={Clock} color="bg-amber-500" />
        <StatCard label="Granted" value={data.summary.activePatents} icon={CheckCircle} color="bg-emerald-500" />
        <StatCard label="Rejected" value={data.summary.criticalAlerts} icon={AlertCircle} color="bg-rose-500" />
        <StatCard label="Success Rate" value={`${data.summary.successRate}%`} icon={TrendingUp} color="bg-violet-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FILING EVOLUTION CHART */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 h-[450px]">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Status Evolution Over Time</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.timeline}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Area type="monotone" dataKey="innovations" stroke="#6366F1" strokeWidth={4} fill="url(#colorTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* FIELD DISTRIBUTION CHART */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 h-[450px]">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Technology Field Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.distribution} dataKey="value" nameKey="name" innerRadius={80} outerRadius={120} paddingAngle={8} stroke="none">
                {data.distribution.map((entry, index) => (
                  <Cell key={index} fill={FIELD_COLORS[index % FIELD_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...CHART_CONFIG.tooltip} />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DRILL-DOWN REPOSITORY TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Interactive Filing Repository</h3>
          <div className="relative w-80">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Filter Repository..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none" />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 tracking-widest">Filing ID</th>
              <th className="px-8 py-5 tracking-widest">Applicant</th>
              <th className="px-8 py-5 tracking-widest">Jurisdiction</th>
              <th className="px-8 py-5 tracking-widest">Status</th>
              <th className="px-8 py-5 tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableData.map((asset) => (
              <tr key={asset.id} className="text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <td className="px-8 py-5 text-slate-900 font-black">{asset.assetNumber}</td>
                <td className="px-8 py-5">{asset.assignee}</td>
                <td className="px-8 py-5">{asset.jurisdiction}</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase" 
                        style={{ backgroundColor: STATUS_COLORS[asset.status?.toUpperCase()] + '20', color: STATUS_COLORS[asset.status?.toUpperCase()] }}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right"><Eye size={16} className="text-indigo-600 inline cursor-pointer" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className={`${color} p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group transition-transform hover:scale-105`}>
    <Icon className="absolute -right-4 -top-4 w-24 h-24 opacity-10" />
    <p className="text-3xl font-black tracking-tighter mb-2">{formatNumber(value)}</p>
    <p className="text-[9px] font-black uppercase tracking-widest opacity-70 leading-none">{label}</p>
  </div>
);

export default LegalDashboardPage;