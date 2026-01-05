import React, { useState, useEffect } from 'react';
import {
  FileText, TrendingUp, Shield, AlertCircle, Globe, Clock,
  CheckCircle, BarChart3, Calendar, DollarSign,
  Plus, Loader2, Search, MapPin, Database, ChevronRight
} from 'lucide-react';
import axios from 'axios';

/**
 * PREMIUM GLOBAL IP DASHBOARD 
 * Integrated with SearchResultsPage, LegalDashboardPage, and Landscape View.
 * Backend Port: 5001
 */
const DashboardHome = ({ onNavigate, user }) => {
  const currentYear = new Date().getFullYear();
  // Ensure this matches your Spring Boot or Analytics Node port
  const API_BASE = "http://localhost:5001/api/dashboard";

  // --- 1. LOCAL SEARCH STATE ---
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  // --- 2. DYNAMIC DATA STATE ---
  const [dbStats, setDbStats] = useState({
    totalPatents: 0, activeFilings: 0, protectedAssets: 0,
    criticalAlerts: 0, portfolioValue: "0.0", growth: 0
  });
  const [activities, setActivities] = useState([]);
  const [coverage, setCoverage] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 3. BACKEND SYNCHRONIZATION ---
  useEffect(() => {
    const fetchDashboardContext = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        const [stats, activity, reach, tasks] = await Promise.all([
          axios.get(`${API_BASE}/stats`, config),
          axios.get(`${API_BASE}/recent-activity`, config),
          axios.get(`${API_BASE}/global-coverage`, config),
          axios.get(`${API_BASE}/upcoming-deadlines`, config)
        ]);
        
        setDbStats(stats.data);
        setActivities(activity.data || []);
        setCoverage(reach.data || []);
        setDeadlines(tasks.data || []);
      } catch (err) {
        console.error("Dashboard Sync Failed. Using localized fallback.");
        // FALLBACK DATA (Prevents empty UI during development)
        setDbStats({ totalPatents: 124, activeFilings: 42, protectedAssets: 89, criticalAlerts: 3, portfolioValue: "12.4", growth: 12 });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardContext();
  }, [API_BASE]);

  // ✅ 4. SEARCH & NAVIGATION HANDLERS
  const handleSearchNavigation = (e) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      onNavigate('search', { keyword: localSearchTerm });
    }
  };

  const availableRegions = coverage
    .filter(g => g.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 border-4 border-indigo-100 rounded-full animate-ping"></div>
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 relative z-10" />
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Syncing Intelligence Node...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 text-left pb-20">
      
      {/* ===== 1. HEADER & SEARCH BAR ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Intelligence Overview</h2>
          <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase underline decoration-indigo-500 underline-offset-4">Live Asset Repository • {currentYear}</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <form onSubmit={handleSearchNavigation} className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Quick Search Patents..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all shadow-sm"
            />
          </form>
          <button 
            onClick={() => onNavigate('new-filing')} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} /> New Filing
          </button>
        </div>
      </div>

      {/* ===== 2. HERO BANNER SECTION ===== */}
      <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group border border-white/5">
        <div className="relative z-10">
          <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2">
             <Shield size={14} /> Security Cleared / <span className="text-white decoration-indigo-500/50 underline underline-offset-8 capitalize">{user?.name || 'Authorized Analyst'}</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-black leading-[1.1] max-w-2xl tracking-tighter uppercase mb-8">
            Protect your ideas. <br/>Turn innovation into ownership.
          </h1>
          
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={() => onNavigate('legal-dashboard')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl transition-all active:scale-95 group/btn"
            >
              <BarChart3 size={18} className="group-hover/btn:rotate-12 transition-transform" />
              Launch Legal Dashboard
            </button>
            <button 
              onClick={() => onNavigate('landscape')}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-2xl flex items-center gap-4 transition-all"
            >
               <Globe size={18} className="text-indigo-400" />
               <div className="text-left">
                  <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest leading-none">Global Reach</p>
                  <p className="text-sm font-black tracking-tight">View Landscape</p>
               </div>
            </button>
          </div>
        </div>
        <Globe className="absolute -right-20 -bottom-20 w-[400px] h-[400px] text-indigo-500 opacity-10 group-hover:rotate-45 transition-transform duration-[6000ms]" />
      </div>

      {/* ===== 3. KPI METRICS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Patents', value: dbStats.totalPatents, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Filings', value: dbStats.activeFilings, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Protected Assets', value: dbStats.protectedAssets, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Critical Alerts', value: dbStats.criticalAlerts, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' }
        ].map((k, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group relative overflow-hidden">
            <div className={`p-4 rounded-2xl w-fit mb-6 ${k.bg} group-hover:bg-indigo-600 transition-colors duration-500`}>
              <k.icon className={`w-6 h-6 ${k.color} group-hover:text-white transition-colors`} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{k.label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{k.value}</p>
          </div>
        ))}
      </div>

      {/* ===== 4. REGIONAL ANALYSIS ===== */}
      {availableRegions.length > 0 && (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3 leading-none">
                  <MapPin size={20} className="text-indigo-600" /> High-Availability Regions
              </h3>
              <button onClick={() => onNavigate('landscape')} className="text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Full Analysis <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {availableRegions.map((g, i) => (
                    <div key={i} className="p-6 bg-slate-50/50 rounded-3xl hover:bg-white hover:shadow-xl border border-transparent hover:border-indigo-100 transition-all group">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest group-hover:text-indigo-600">
                            <span>{g.region}</span>
                            <span className="font-mono">{g.percent}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" style={{ width: `${g.percent}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* ===== 5. PORTFOLIO VALUATION ===== */}
      <div className="bg-slate-900 text-white rounded-[3rem] p-12 flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden border-b-8 border-indigo-500">
        <div className="relative z-10 text-center md:text-left">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-4 font-mono">Cumulative Asset Assessment</p>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-black tracking-tighter">${dbStats.portfolioValue}</span>
            <span className="text-3xl font-black text-indigo-500 ml-1">M</span>
          </div>
          <div className="flex items-center gap-4 mt-8 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl w-fit mx-auto md:mx-0">
             <div className="p-1.5 bg-emerald-500/10 rounded-lg"><TrendingUp size={18} className="text-emerald-400" /></div>
             <span className="uppercase text-[10px] font-black tracking-widest">+{dbStats.growth}% quarterly expansion</span>
          </div>
        </div>
        <DollarSign className="w-56 h-56 text-white opacity-5 absolute -right-12 top-0 md:static md:opacity-10" />
      </div>

      {/* ===== 6. BOTTOM LOGS GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4 leading-none mb-10">
            <Clock size={20} className="text-indigo-600" /> Recent Activity
          </h3>
          <div className="space-y-4">
            {activities.length > 0 ? activities.map((a, idx) => (
              <div key={idx} className="flex items-center gap-6 p-5 rounded-[2rem] hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100 cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                  <CheckCircle size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-800 uppercase text-xs tracking-widest mb-1">{a.title}</p>
                  <p className="text-slate-400 text-xs truncate max-w-sm italic">{a.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{a.time}</p>
                </div>
              </div>
            )) : (
                <div className="py-20 text-center opacity-30">
                    <Database size={48} className="mx-auto mb-4" />
                    <p className="font-black text-xs uppercase tracking-[0.3em]">No node logs found</p>
                </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 flex items-center gap-4 leading-none">
            <Calendar size={18} className="text-indigo-600" /> Compliance Gate
          </h3>
          <div className="space-y-4">
            {deadlines.length > 0 ? deadlines.map((d, i) => (
              <div key={i} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:bg-white hover:shadow-xl transition-all">
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{d.task}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{d.date}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${d.priority === 'High' ? 'bg-red-50 text-red-600 shadow-sm' : 'bg-amber-50 text-amber-600 shadow-sm'}`}>
                  {d.priority}
                </span>
              </div>
            )) : (
                <div className="py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Compliance Clear</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;