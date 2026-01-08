import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, FileText, CheckCircle, Clock, RefreshCw, AlertTriangle, 
  Activity, Globe, Calendar, X, Users, Download, Zap, Shield, 
  Lightbulb, ArrowUpRight, Search, ChevronRight, FileJson, 
  Table, Printer, ChevronDown, Layers
} from 'lucide-react';

// API and Helper imports (Mocked for this context)
import { analyticsAPI } from '../api/analytics';

/**
 * UTILITIES & CONSTANTS
 */
const STATUS_COLORS = {
  'ACTIVE': '#10b981',    // Emerald-500
  'GRANTED': '#10b981',   // Emerald-500
  'PENDING': '#f59e0b',   // Amber-500
  'EXPIRING': '#ef4444',  // Red-500
  'ABANDONED': '#94a3b8', // Slate-400
  'LITIGATION': '#6366f1' // Indigo-500
};

const JURISDICTIONS = [
  { label: 'United States (USPTO)', value: 'US' },
  { label: 'European Union (EPO)', value: 'EP' },
  { label: 'China (CNIPA)', value: 'CN' },
  { label: 'Japan (JPO)', value: 'JP' },
  { label: 'India (IPO)', value: 'IN' }
];

const ASSET_TYPES = [
  { label: 'All Asset Types', value: 'all' },
  { label: 'Patents', value: 'patent' },
  { label: 'Trademarks', value: 'trademark' },
  { label: 'Copyrights', value: 'copyright' },
  { label: 'Trade Secrets', value: 'trade-secret' }
];

const DATE_RANGES = [
  { label: 'Last Week', value: 'last_week' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last Quarter', value: 'last_quarter' },
  { label: 'Last Year', value: 'last_year' },
  { label: 'All Time', value: 'all_time' }
];

const formatNumber = (num) => new Intl.NumberFormat().format(num);

// --- EXPORT HELPERS ---
const downloadJSON = (data, filename) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  if (!array || array.length === 0) return '';
  let str = '';
  let line = '';
  // Header
  for (let index in array[0]) {
      if (line !== '') line += ',';
      line += index;
  }
  str += line + '\r\n';
  // Lines
  for (let i = 0; i < array.length; i++) {
      line = '';
      for (let index in array[i]) {
          if (line !== '') line += ',';
          line += array[i][index];
      }
      str += line + '\r\n';
  }
  return str;
};

const downloadCSV = (data, filename) => {
  const csvStr = convertToCSV(data);
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const LegalDashboardPage = () => {
  // --- 1. STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [dateRange, setDateRange] = useState('last_year'); 
  const [selectedType, setSelectedType] = useState('all');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all');
  
  // UI State
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState({
    summary: { totalFilings: 0, activePatents: 0, pendingApplications: 0, expiringSoon: 0 },
    statusDistribution: [],
    filingsTrend: [],
    recentActivities: [] 
  });

  // Drill-down Modal State
  const [modalTitle, setModalTitle] = useState(null);
  const [drillDownData, setDrillDownData] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  // --- 2. DATA FETCHING LOGIC ---
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    
    try {
      const params = { 
        range: dateRange, 
        type: selectedType, 
        jurisdiction: selectedJurisdiction,
        t: new Date().getTime() 
      };
      
      // Execute all API calls defined in analytics.js
      const [summary, statusDist, filingsTrend] = await Promise.all([
        analyticsAPI.getDashboardSummary(params),
        analyticsAPI.getStatusDistribution(params),
        analyticsAPI.getFilingsTrend(params)
      ]);
      
      setDashboardData(prev => ({ 
        ...prev,
        summary: summary || { totalFilings: 0, activePatents: 0, pendingApplications: 0, expiringSoon: 0 }, 
        statusDistribution: statusDist?.data || [], 
        filingsTrend: filingsTrend?.data || []
      }));
    } catch (err) {
      console.error('Database fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange, selectedType, selectedJurisdiction]);

  useEffect(() => { 
    fetchDashboardData(); 
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => { fetchDashboardData(true); }, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // --- 3. EVENT HANDLERS ---
  const handleCardClick = async (title, filterContext) => {
    setModalTitle(title);
    setLoadingModal(true);
    setDrillDownData([]);
    
    try {
      // Simulate fetching detailed list for the clicked category
      // In production, this would pass 'filterContext' (e.g., 'ACTIVE', 'EXPIRING') to the API
      const response = await analyticsAPI.getAssetsByCategory(
        filterContext, 
        dateRange, 
        selectedType, 
        selectedJurisdiction
      );
      setDrillDownData(response?.data || []);
    } catch (error) {
      console.error("Drill-down error:", error);
      setDrillDownData([]);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleChartClick = (data) => {
    if (!data || !data.activePayload || !data.activePayload[0]) return;
    const payload = data.activePayload[0].payload;
    const key = payload.name;
    handleCardClick(`Category: ${key}`, key);
  };

  // Export Logic
  const handleExport = (format) => {
    setExportMenuOpen(false);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `legal_analytics_export_${timestamp}`;

    if (format === 'csv') {
      const flatData = dashboardData.statusDistribution.map(item => ({
         Category: item.name,
         Count: item.value,
         Jurisdiction: selectedJurisdiction,
         Period: dateRange
      }));
      downloadCSV(flatData, filename);
    } else if (format === 'json') {
      downloadJSON(dashboardData, filename);
    } else if (format === 'print') {
        window.print();
    }
  };

  if (loading && !refreshing) return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <RefreshCw className="w-12 h-12 text-blue-600 mb-4" />
      </motion.div>
      <span className="text-slate-500 font-bold tracking-widest animate-pulse uppercase text-xs">Synchronizing Intelligence...</span>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900 print:bg-white print:p-0">
      
      {/* HEADER SECTION - Hidden on Print */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6 print:hidden"
      >
        <div>
           <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Legal Assets <span className="text-blue-600">Analytics</span></h1>
           <p className="text-slate-500 font-medium mt-1">Real-time database performance and lifecycle monitoring</p>
        </div>
        
        {/* --- MAIN CONTROL BAR --- */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200">
            
            {/* Filter: Date Range (Updated) */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <Calendar className="w-4 h-4 text-slate-500" />
                <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)} 
                    className="text-sm bg-transparent outline-none text-slate-700 font-bold cursor-pointer pr-2"
                >
                    {DATE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
            </div>

            <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

            {/* Filter: Jurisdiction */}
            <div className="flex items-center gap-2 px-3 py-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <select 
                    value={selectedJurisdiction} 
                    onChange={(e) => setSelectedJurisdiction(e.target.value)} 
                    className="text-sm bg-transparent outline-none text-slate-700 font-bold cursor-pointer max-w-[100px] md:max-w-none truncate"
                >
                    <option value="all">Global</option>
                    {JURISDICTIONS.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
                </select>
            </div>

            <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

            {/* Filter: Asset Type */}
            <div className="flex items-center gap-2 px-3 py-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)} 
                    className="text-sm bg-transparent outline-none text-slate-700 font-bold cursor-pointer max-w-[100px] md:max-w-none truncate"
                >
                    {ASSET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
            </div>

            {/* Export Dropdown */}
            <div className="relative ml-2">
                <button 
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-200"
                >
                    <Download className="w-4 h-4" /> Export <ChevronDown size={14} className={`transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`}/>
                </button>

                <AnimatePresence>
                    {exportMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20"
                        >
                            <div className="p-1 flex flex-col gap-1">
                                <button onClick={() => handleExport('csv')} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors text-left">
                                    <Table className="w-4 h-4" /> CSV Data
                                </button>
                                <button onClick={() => handleExport('json')} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-amber-600 rounded-xl transition-colors text-left">
                                    <FileJson className="w-4 h-4" /> JSON Raw
                                </button>
                                <div className="h-[1px] bg-slate-100 my-1" />
                                <button onClick={() => handleExport('print')} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-colors text-left">
                                    <Printer className="w-4 h-4" /> PDF Report
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </motion.div>

      {/* SUMMARY STATS CARDS - Clickable to show recent details */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 print:grid-cols-4 print:gap-4"
      >
        <StatCard 
          label="Total Filings" 
          value={dashboardData.summary.totalFilings} 
          icon={<FileText className="w-6 h-6" />} 
          color="blue"
          onClick={() => handleCardClick('Recent Filings', 'ALL')}
        />
        <StatCard 
          label="Active Patents" 
          value={dashboardData.summary.activePatents} 
          icon={<CheckCircle className="w-6 h-6" />} 
          color="green"
          onClick={() => handleCardClick('Active Grants', 'ACTIVE')}
        />
        <StatCard 
          label="Pending" 
          value={dashboardData.summary.pendingApplications} 
          icon={<Clock className="w-6 h-6" />} 
          color="amber"
          onClick={() => handleCardClick('Pending Applications', 'PENDING')}
        />
        <StatCard 
          label="Critical Alerts" 
          value={dashboardData.summary.expiringSoon} 
          icon={<AlertTriangle className="w-6 h-6" />} 
          color="red"
          onClick={() => handleCardClick('Critical Alerts (Due Soon)', 'EXPIRING')}
        />
      </motion.div>

      {/* VISUALIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 print:block print:mb-4">
        {/* Status Distribution (Pie) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 print:shadow-none print:border print:mb-4 print:break-inside-avoid"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-3">
              <span className="p-2 bg-blue-50 rounded-lg text-blue-600 print:hidden"><Activity size={20}/></span>
              Status Distribution
            </h3>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={dashboardData.statusDistribution} 
                  dataKey="value" nameKey="name" 
                  cx="50%" cy="50%" outerRadius={110} innerRadius={80} paddingAngle={5}
                  onClick={handleChartClick} cursor="pointer"
                >
                  {dashboardData.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} strokeWidth={2} stroke="#fff" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Filing Trends (Area) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 print:shadow-none print:border print:break-inside-avoid"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-3">
              <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600 print:hidden"><TrendingUp size={20}/></span>
              Filing Trends
            </h3>
            <div className="flex gap-2 print:hidden">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase">
                   <ArrowUpRight size={12}/> Growth
                </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.filingsTrend}>
                <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} />
                <Tooltip cursor={{ stroke: '#3b82f6', strokeWidth: 2 }} />
                <Area 
                  type="monotone" 
                  dataKey="patents" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorTrend)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* INTELLIGENCE FEED */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 mb-12 print:hidden"
      >
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Intelligence Feed</h2>
          <div className="h-[1px] flex-1 bg-slate-200" />
          <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View All Reports <ChevronRight size={16}/>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DummyCard 
            icon={<Zap className="text-amber-500" />}
            title="Accelerated Growth"
            description="Machine Learning patents in your portfolio have increased by 34% compared to the previous fiscal period."
            tag="AI & ML"
            trend="+34.2%"
          />
          <DummyCard 
            icon={<Shield className="text-indigo-500" />}
            title="Compliance Alert"
            description="Renewal deadlines for 12 core assets in the European jurisdiction are approaching in the next 45 days."
            tag="Renewals"
            trend="12 Due"
          />
          <DummyCard 
            icon={<Lightbulb className="text-emerald-500" />}
            title="Whitespace Detected"
            description="Potential licensing opportunities identified in the APAC semi-conductor sector based on filing trends."
            tag="Strategic"
            trend="High Priority"
          />
        </div>
      </motion.div>

      {/* DRILL-DOWN MODAL (Shows Recent Details on Click) */}
      <AnimatePresence>
        {modalTitle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 print:hidden"
          >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden border border-white/20"
            >
                <div className="flex justify-between items-center p-8 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{modalTitle}</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {loadingModal ? 'Fetching recent data...' : `Showing ${drillDownData.length} recent records`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {/* Inner Modal Export */}
                    <button onClick={() => downloadCSV(drillDownData, `details_${modalTitle}`)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500 hover:text-blue-600">
                        <Download className="w-5 h-5" />
                    </button>
                    <button onClick={() => setModalTitle(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-red-500">
                        <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto p-8 flex-1 bg-[#F8FAFC]">
                  {loadingModal ? (
                    <div className="flex flex-col items-center justify-center py-24">
                      <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Querying Database...</p>
                    </div>
                  ) : drillDownData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 font-bold text-lg mb-2">No Records Found</h3>
                      <p className="text-slate-500 max-w-xs">The filtered criteria returned zero results. Please adjust your global filters.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {drillDownData.map((asset, idx) => (
                        <motion.div 
                            key={asset.id || idx} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 flex flex-col md:flex-row justify-between items-start md:items-center group transition-all"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                                asset.type === 'PATENT' ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'
                              }`}>
                                {asset.type || 'ASSET'}
                              </span>
                              <span className="text-xs text-slate-400 font-mono font-bold tracking-tight">{asset.assetNumber || 'N/A'}</span>
                            </div>
                            <h4 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                              {asset.title || 'Untitled Asset'}
                            </h4>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                              <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><Users size={14}/> {asset.assignee || 'Unknown Assignee'}</span>
                              <span className="flex items-center gap-1.5"><Calendar size={14}/> {asset.filingDate ? new Date(asset.filingDate).toLocaleDateString() : 'Date N/A'}</span>
                            </div>
                          </div>
                          <div className="mt-5 md:mt-0 md:text-right md:pl-8 md:border-l border-slate-100 flex flex-col items-start md:items-end">
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                              ['ACTIVE', 'GRANTED'].includes(asset.status) ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {asset.status || 'UNKNOWN'}
                            </span>
                            <div className="mt-3 text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                              <Globe className="w-4 h-4 text-slate-300"/> {asset.jurisdiction || 'Global'}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
                   <button 
                    onClick={() => setModalTitle(null)} 
                    className="px-8 py-3 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-2xl text-sm transition-all shadow-lg"
                   >
                      CLOSE DASHBOARD
                   </button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, icon, color, onClick }) => {
  const colorMap = {
    blue: 'from-blue-600 to-blue-400 text-white shadow-blue-200',
    green: 'from-emerald-600 to-emerald-400 text-white shadow-emerald-200',
    amber: 'from-amber-500 to-orange-400 text-white shadow-amber-200',
    red: 'from-rose-600 to-red-400 text-white shadow-rose-200',
  };

  return (
    <motion.div 
      variants={itemVariants}
      onClick={onClick} 
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 cursor-pointer group relative overflow-hidden transition-all print:shadow-none print:border print:p-4 print:rounded-xl"
    >
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 mb-4 print:w-8 print:h-8 print:mb-2`}>
            {React.cloneElement(icon, { className: "w-7 h-7 print:w-4 print:h-4" })}
        </div>
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-slate-900 print:text-2xl">{formatNumber(value)}</p>
          </div>
        </div>
      </div>
      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 print:hidden" />
    </motion.div>
  );
};

const DummyCard = ({ icon, title, description, tag, trend }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-slate-50 rounded-2xl">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-100 px-3 py-1 rounded-full">{tag}</span>
        </div>
        <h4 className="text-lg font-black text-slate-900 mb-3">{title}</h4>
        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-1">
            {description}
        </p>
        <div className="flex justify-between items-center pt-6 border-t border-slate-50">
            <span className="text-xs font-bold text-slate-400 uppercase">Analysis Trend</span>
            <span className="text-sm font-black text-blue-600">{trend}</span>
        </div>
    </motion.div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 text-xs">
        <p className="font-black uppercase tracking-widest mb-1">{payload[0].name}</p>
        <p className="text-xl font-bold">{formatNumber(payload[0].value)} <span className="text-[10px] text-slate-400 font-medium">Assets</span></p>
      </div>
    );
  }
  return null;
};

export default LegalDashboardPage;