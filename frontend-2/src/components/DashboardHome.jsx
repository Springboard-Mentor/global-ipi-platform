import React, { useState, useEffect } from 'react';
import {
  FileText, TrendingUp, Shield, AlertCircle, Globe, Clock,
  CheckCircle, Calendar,
  Plus, Loader2, Search, MapPin, Database, Activity, Crown, Menu, 
  Bell, BellRing, Lock
} from 'lucide-react';
import axios from 'axios';

const DashboardHome = ({ onNavigate, user }) => {
  const currentYear = new Date().getFullYear();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // --- STATE ---
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [dbStats, setDbStats] = useState({
    totalPatents: 0, activeFilings: 0, protectedAssets: 0,
    criticalAlerts: 0, portfolioValue: "0.0", growth: 0
  });
  const [activities, setActivities] = useState([]);
  const [coverage, setCoverage] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- PLAN & ACCESS LOGIC ---
  const userPlan = user?.planType || 'STARTUP';

  const getPlanDisplayName = (plan) => {
    switch(plan) {
      case 'ENTERPRISE': return 'GLOBAL ENTERPRISE';
      case 'PRO': return 'IP PROFESSIONAL';
      case 'STARTUP': default: return 'INVENTOR BASIC';
    }
  };

  const checkAccess = (minPlan) => {
    if (minPlan === 'STARTUP') return true;
    if (minPlan === 'PRO' && (userPlan === 'PRO' || userPlan === 'ENTERPRISE')) return true;
    if (minPlan === 'ENTERPRISE' && userPlan === 'ENTERPRISE') return true;
    return false;
  };

  // --- BACKEND SYNC ---
  useEffect(() => {
    const fetchDashboardContext = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      try {
        const [stats, activity, reach, tasks] = await Promise.all([
          axios.get(`${API_BASE}/dashboard/stats`, config).catch(() => ({ data: {} })),
          axios.get(`${API_BASE}/dashboard/recent-activity`, config).catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/dashboard/global-coverage`, config).catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/dashboard/upcoming-deadlines`, config).catch(() => ({ data: [] }))
        ]);

        setDbStats(stats.data || {});
        setActivities(activity.data || []);
        setCoverage(reach.data || []);
        setDeadlines(tasks.data || []);

        if (user && user.id) {
            const notifRes = await axios.get(`${API_BASE}/notifications/user/${user.id}`, config);
            const activeNotifs = notifRes.data || [];
            setNotifications(activeNotifs);
            setUnreadCount(activeNotifs.filter(n => !n.isRead).length);
        }
      } catch (err) {
        console.error("Dashboard Sync Failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardContext();
  }, [API_BASE, user]);

  const handleSearchNavigation = (e) => {
    e.preventDefault();
    if (localSearchTerm.trim()) onNavigate('search', localSearchTerm);
  };

  const handleNotificationClick = async (id) => {
    const updatedNotifs = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updatedNotifs);
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_BASE}/notifications/read/${id}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
    } catch (e) { console.error(e); }
  };

  const availableRegions = coverage.filter(g => g.percent > 0).sort((a, b) => b.percent - a.percent).slice(0, 5);
  const isPremium = userPlan === 'PRO' || userPlan === 'ENTERPRISE';

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50">
      
      {/* MOBILE SIDEBAR (Handled by Layout mostly, but kept overlay for safety) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="space-y-6 md:space-y-10 animate-in fade-in duration-1000 text-left pb-20 px-4 md:px-8 lg:px-12 pt-6">
        
        {/* ===== 1. DASHBOARD HEADER ===== */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-200 pb-8">
          <div className="flex justify-between items-center w-full lg:w-auto">
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-1">
                 <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Intelligence Overview</h2>
                 {/* ✅ Dynamic Plan Badge */}
                 <span className={`text-[8px] text-white font-black px-2 py-0.5 rounded flex items-center gap-1 tracking-[0.1em] ${userPlan === 'STARTUP' ? 'bg-slate-500' : 'bg-indigo-600'}`}>
                    <Crown size={8} /> {getPlanDisplayName(userPlan)}
                 </span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase underline decoration-indigo-500 underline-offset-4">Live Asset Repository • {currentYear}</p>
            </div>
            {/* Mobile Menu Trigger */}
            <button className="lg:hidden p-2 bg-white border rounded-xl" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={22} className="text-slate-600" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto relative">
            
            {/* ✅ NOTIFICATION BELL (Only Here) */}
            <div className="relative z-50">
               <button 
                   onClick={() => setShowNotifications(!showNotifications)}
                   className={`p-3.5 rounded-2xl transition-all shadow-sm relative focus:outline-none ${showNotifications ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 border hover:border-indigo-200 hover:text-indigo-600'}`}
               >
                   <Bell size={20} />
                   {unreadCount > 0 && (
                       <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-slate-50 animate-bounce">
                           {unreadCount}
                       </span>
                   )}
               </button>
               {/* Notification Panel */}
               {showNotifications && (
                   <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                       <div className="p-5 border-b border-slate-50 bg-slate-50/80 flex justify-between items-center backdrop-blur-md">
                           <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                               <BellRing size={14} className="text-indigo-600"/> Notifications
                           </h3>
                           {unreadCount > 0 ? (
                               <span className="text-[9px] font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded border border-rose-100 shadow-sm">{unreadCount} Unread</span>
                           ) : (
                               <span className="text-[9px] font-bold text-slate-400">All caught up</span>
                           )}
                       </div>
                       <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                           {notifications.length > 0 ? (
                               notifications.map((n) => (
                                   <div 
                                       key={n.id} 
                                       onClick={() => handleNotificationClick(n.id)}
                                       className={`p-4 border-b border-slate-50 transition-colors cursor-pointer group ${
                                           !n.isRead ? 'bg-indigo-50/40 hover:bg-indigo-50' : 'hover:bg-slate-50'
                                       }`}
                                   >
                                       <div className="flex justify-between items-start mb-1.5">
                                           <div className="flex items-center gap-2">
                                               {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>}
                                               <span className={`text-[10px] font-black uppercase tracking-wide ${n.type === 'Status Update' ? 'text-indigo-600' : 'text-amber-600'}`}>
                                                   {n.type || 'System Alert'}
                                               </span>
                                           </div>
                                           <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap ml-2">
                                               {new Date(n.timestamp).toLocaleDateString()}
                                           </span>
                                       </div>
                                       <p className={`text-xs leading-relaxed ${!n.isRead ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                                           {n.message}
                                       </p>
                                   </div>
                               ))
                           ) : (
                               <div className="py-12 px-8 text-center flex flex-col items-center opacity-50">
                                   <div className="p-4 bg-slate-50 rounded-full mb-3">
                                       <Bell size={24} className="text-slate-300" />
                                   </div>
                                   <p className="text-xs font-bold text-slate-400">No notifications yet.</p>
                               </div>
                           )}
                       </div>
                       <div className="p-3 border-t border-slate-50 bg-slate-50 text-center">
                           <button onClick={() => setShowNotifications(false)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">Close Panel</button>
                       </div>
                   </div>
               )}
            </div>

            {/* Upgrade Button */}
            <button 
              onClick={() => onNavigate('pricing')} 
              className={`hidden md:flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 whitespace-nowrap ${
                isPremium 
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200' 
                  : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:brightness-110 shadow-orange-200'
              }`}
            >
              <Crown size={16} fill={isPremium ? "currentColor" : "white"} />
              {isPremium ? 'Premium Active' : 'Upgrade to Pro'}
            </button>

            {/* Search Bar */}
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
            
            {/* ✅ New Filing Button - LOCKED IF BASIC */}
            <button 
              onClick={() => checkAccess('PRO') ? onNavigate('new-filing') : onNavigate('pricing')} 
              className={`px-6 py-3.5 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 whitespace-nowrap w-full md:w-auto ${
                checkAccess('PRO') 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100' 
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              {checkAccess('PRO') ? <Plus size={16} /> : <Lock size={14} />} 
              New Filing
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
              {/* ✅ Filing Tracker Button - LOCKED IF BASIC */}
              <button 
                onClick={() => checkAccess('PRO') ? onNavigate('filing-tracker') : onNavigate('pricing')}
                className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 group/btn ${
                    checkAccess('PRO')
                    ? 'bg-indigo-600 hover:bg-indigo-50 hover:text-indigo-900 text-white'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {checkAccess('PRO') ? (
                    <>
                        <Activity size={18} className="group-hover/btn:rotate-12 transition-transform" />
                        Open Filing Tracker
                    </>
                ) : (
                    <>
                        <Lock size={16} /> Tracker Locked (Upgrade)
                    </>
                )}
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

        {/* ... (Regional & Activity Grids - Standard) ... */}
        {/* Keeping layout compact for response, logic here is standard display */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
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