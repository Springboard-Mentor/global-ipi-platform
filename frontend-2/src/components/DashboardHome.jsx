import React, { useState, useEffect } from 'react';
import {
  FileText, TrendingUp, Shield, AlertCircle, Globe, Clock,
  CheckCircle, BarChart3, Calendar, DollarSign,
  Plus, Loader2, Search, MapPin, Database, Activity, Crown, Menu, X, Settings, LogOut, LayoutDashboard, SearchCode, FolderKanban, FilePlus
} from 'lucide-react';
import axios from 'axios';

/**
 * PREMIUM GLOBAL IP DASHBOARD 
 * Fix: Added Authorization Headers to resolve 403 Forbidden Errors
 */
const DashboardHome = ({ onNavigate, user }) => {
  const currentYear = new Date().getFullYear();
  const API_BASE = "http://192.168.43.45:5001/api/dashboard";

  // --- 1. STATE MANAGEMENT ---
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dynamic Data State
  const [dbStats, setDbStats] = useState({
    totalPatents: 0, activeFilings: 0, protectedAssets: 0,
    criticalAlerts: 0, portfolioValue: "0.0", growth: 0
  });
  const [activities, setActivities] = useState([]);
  const [coverage, setCoverage] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 2. BACKEND SYNCHRONIZATION ---
  useEffect(() => {
    const fetchDashboardContext = async () => {
      setLoading(true);
      
      // ✅ FIX: Retrieve Token & Create Config
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      try {
        // ✅ FIX: Pass 'config' to every axios call
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
        console.error("Dashboard Sync Failed:", err.message);
        if (err.response && err.response.status === 403) {
            console.error("Access Denied: Token missing or invalid.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardContext();
  }, [API_BASE]);

  // --- 3. HANDLERS ---
  const handleSearchNavigation = (e) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      onNavigate('search', localSearchTerm);
    }
  };

  // --- 4. LOGIC COMPUTATION ---
  const availableRegions = coverage
    .filter(g => g.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);

  const isPremium = user?.planType === 'PRO' || user?.planType === 'ENTERPRISE';
  const activePlanName = user?.planType ? user.planType : "STARTER";

  // --- 5. LOADING STATE ---
  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-6 px-4 text-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 border-4 border-indigo-100 rounded-full animate-ping"></div>
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 relative z-10" />
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Syncing Intelligence Node...</p>
      </div>
    );
  }

  // --- 6. RENDER ---
  return (
    <div className="relative min-h-screen bg-slate-50">
      
      {/* MOBILE OVERLAY FOR SIDEBAR */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR (Hamburger Menu Content) */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#0F172A] z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Shield size={18} className="text-white" />
              </div>
              <span className="font-black text-white tracking-tighter text-lg uppercase">Global IP</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {[
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'patents', label: 'My Patents', icon: FolderKanban },
              { id: 'search', label: 'Search IP Analysis', icon: SearchCode },
              { id: 'filing-tracker', label: 'Filing Tracker', icon: Clock },
              { id: 'new-filing', label: 'New Filing', icon: FilePlus },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <button className="mt-auto flex items-center gap-4 px-4 py-4 text-rose-400 font-black text-xs uppercase tracking-widest hover:bg-rose-500/10 rounded-xl transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="space-y-6 md:space-y-10 animate-in fade-in duration-1000 text-left pb-20 px-4 md:px-8 lg:px-12 pt-6">
        
        {/* ===== 1. RESPONSIVE HEADER & NAVIGATION ===== */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-200 pb-8">
          <div className="flex justify-between items-center w-full lg:w-auto">
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-1">
                 <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Intelligence Overview</h2>
                 {/* DYNAMIC PLAN BADGE */}
                 <span className="bg-indigo-600 text-[8px] text-white font-black px-2 py-0.5 rounded flex items-center gap-1 tracking-[0.1em]">
                    <Crown size={8} /> {activePlanName}
                 </span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase underline decoration-indigo-500 underline-offset-4">Live Asset Repository • {currentYear}</p>
            </div>

            {/* Hamburger for Mobile Trigger */}
            <button 
              className="lg:hidden p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} className="text-slate-600" />
            </button>
          </div>

          {/* Action Bar (Search & Subscription Button) */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
            
            <button 
              onClick={() => onNavigate('pricing')} 
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 whitespace-nowrap w-full md:w-auto ${
                isPremium 
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-emerald-100 border border-emerald-200' 
                  : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:brightness-110 shadow-orange-200'
              }`}
            >
              <Crown size={16} fill={isPremium ? "currentColor" : "white"} />
              {isPremium ? 'Premium Active' : 'Upgrade to Pro'}
            </button>

            <form onSubmit={handleSearchNavigation} className="relative group w-full md:w-80">
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95 whitespace-nowrap w-full md:w-auto"
            >
              <Plus size={16} /> New Filing
            </button>
          </div>
        </div>

        {/* ===== 2. HERO BANNER ===== */}
        <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group border border-white/5">
          <div className="relative z-10">
            <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2">
               <Shield size={14} /> Security Cleared / <span className="text-white decoration-indigo-500/50 underline underline-offset-8 capitalize">{user?.name || 'Authorized Analyst'}</span>
            </p>
            <h1 className="text-3xl md:text-5xl font-black leading-[1.1] max-w-2xl tracking-tighter uppercase mb-8">
              Protect your ideas. <br className="hidden md:block" />Turn innovation into ownership.
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => onNavigate('filing-tracker')}
                className="bg-indigo-600 hover:bg-indigo-50 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 group/btn"
              >
                <Activity size={18} className="group-hover/btn:rotate-12 transition-transform" />
                Open Filing Tracker
              </button>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-2xl flex flex-col justify-center text-center sm:text-left">
                 <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest leading-none mb-1">Active Portfolio Size</span>
                 <span className="text-2xl font-black tracking-tight">{dbStats.totalPatents} Assets</span>
              </div>
            </div>
          </div>
          <Globe className="absolute -right-20 -bottom-20 w-64 h-64 md:w-[400px] md:h-[400px] text-indigo-500 opacity-10 group-hover:rotate-45 transition-transform duration-[6000ms]" />
        </div>

        {/* ===== 3. KPI METRICS GRID ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Total Patents', value: dbStats.totalPatents, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Filings', value: dbStats.activeFilings, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Protected Assets', value: dbStats.protectedAssets, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Critical Alerts', value: dbStats.criticalAlerts, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' }
          ].map((k, i) => (
            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group relative overflow-hidden">
              <div className={`p-4 rounded-2xl w-fit mb-6 ${k.bg} group-hover:bg-indigo-600 transition-colors duration-500`}>
                <k.icon className={`w-6 h-6 ${k.color} group-hover:text-white transition-colors`} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{k.label}</p>
              <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none">{k.value}</p>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* ===== 4. REGIONAL ANALYSIS ===== */}
        {availableRegions.length > 0 && (
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm animate-in zoom-in-95 duration-700">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3 leading-none">
                    <MapPin size={20} className="text-indigo-600" /> High-Availability Regions
                </h3>
                <div className="h-px bg-slate-100 flex-1 mx-8 hidden lg:block"></div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Global Dataset</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {availableRegions.map((g, i) => (
                      <div key={i} className="p-6 bg-slate-50/50 rounded-3xl hover:bg-white hover:shadow-xl border border-transparent hover:border-indigo-100 transition-all group">
                          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest group-hover:text-indigo-600">
                              <span>{g.region}</span>
                              <span className="font-mono">{g.percent}%</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${g.percent}%` }} />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        )}

        {/* ===== 5. PORTFOLIO VALUATION ===== */}
        <div className="bg-slate-900 text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden border-b-8 border-indigo-500">
          <div className="relative z-10 text-center md:text-left w-full md:w-auto">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-4 font-mono">Cumulative Asset Assessment</p>
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-5xl md:text-7xl font-black tracking-tighter">${dbStats.portfolioValue}</span>
              <span className="text-2xl md:text-3xl font-black text-indigo-500 ml-1">M</span>
            </div>
            <div className="flex items-center gap-4 mt-8 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl w-fit mx-auto md:mx-0">
               <div className="p-1.5 bg-emerald-500/10 rounded-lg"><TrendingUp size={18} className="text-emerald-400" /></div>
               <span className="uppercase text-[10px] font-black tracking-widest">+{dbStats.growth}% quarterly expansion</span>
            </div>
          </div>
          <DollarSign className="w-40 h-40 md:w-56 md:h-56 text-white opacity-5 absolute -right-8 top-0 md:static md:opacity-10" />
        </div>

        {/* ===== 6. LOGS & COMPLIANCE GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          
          {/* Recent Activity Log */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-6 md:p-10 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4 leading-none">
                <Clock size={20} className="text-indigo-600" /> Recent Activity
              </h3>
            </div>
            <div className="space-y-4">
              {activities.length > 0 ? activities.slice(0, 5).map((a, idx) => (
                <div key={idx} className="flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-[2rem] hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100 cursor-pointer">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all flex-shrink-0">
                    <CheckCircle size={20} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 uppercase text-[10px] md:text-xs tracking-widest leading-none mb-1 truncate">{a.title}</p>
                    <p className="text-slate-400 text-[10px] md:text-xs truncate max-w-sm italic">{a.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{a.time}</p>
                  </div>
                </div>
              )) : (
                  <div className="py-20 text-center flex flex-col items-center opacity-30">
                      <Database size={48} className="mb-4" />
                      <p className="font-black text-xs uppercase tracking-[0.3em]">No node logs found</p>
                  </div>
              )}
            </div>
          </div>

          {/* Compliance Gate */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-6 md:p-10 shadow-sm h-fit">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8 md:mb-10 flex items-center gap-4 leading-none">
              <Calendar size={18} className="text-indigo-600" /> Compliance Gate
            </h3>
            <div className="space-y-4">
              {deadlines.length > 0 ? deadlines.slice(0, 4).map((d, i) => (
                <div key={i} className="flex justify-between items-center p-4 md:p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:bg-white hover:shadow-xl transition-all group">
                  <div className="space-y-1 min-w-0 pr-2">
                    <p className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase leading-none tracking-tight truncate">{d.task}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{d.date}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap ${d.priority === 'High' ? 'bg-red-50 text-red-600 shadow-sm' : 'bg-amber-50 text-amber-600 shadow-sm'}`}>
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
    </div>
  );
};

export default DashboardHome;