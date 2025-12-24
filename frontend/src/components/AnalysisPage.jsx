import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  AlertTriangle, 
  Briefcase, 
  Activity, 
  Target
} from 'lucide-react';

// --- 1. COLOR PALETTE ---
const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']; 

// --- 2. RICH DUMMY DATA (Static Source) ---
const MOCK_DATA = [
    // 2022 Data
    { id: 1, type: 'PATENT', status: 'ACTIVE', filingDate: '2022-01-15', assignee: 'TechCorp' },
    { id: 2, type: 'PATENT', status: 'ACTIVE', filingDate: '2022-02-20', assignee: 'InnoSol' },
    { id: 3, type: 'TRADEMARK', status: 'REGISTERED', filingDate: '2022-03-10', assignee: 'TechCorp' },
    { id: 4, type: 'PATENT', status: 'PENDING', filingDate: '2022-05-05', assignee: 'Global AI' },
    { id: 5, type: 'PATENT', status: 'EXPIRED', filingDate: '2022-06-15', assignee: 'OldTech Inc' },
    
    // 2023 Data
    { id: 6, type: 'PATENT', status: 'ACTIVE', filingDate: '2023-01-10', assignee: 'TechCorp' },
    { id: 7, type: 'TRADEMARK', status: 'REGISTERED', filingDate: '2023-03-22', assignee: 'BrandX' },
    { id: 8, type: 'PATENT', status: 'ACTIVE', filingDate: '2023-04-18', assignee: 'InnoSol' },
    { id: 9, type: 'PATENT', status: 'PENDING', filingDate: '2023-07-30', assignee: 'Global AI' },
    { id: 10, type: 'PATENT', status: 'PENDING', filingDate: '2023-08-12', assignee: 'Future Systems' },
    { id: 11, type: 'TRADEMARK', status: 'REGISTERED', filingDate: '2023-09-05', assignee: 'TechCorp' },
    { id: 12, type: 'PATENT', status: 'ACTIVE', filingDate: '2023-11-20', assignee: 'InnoSol' },

    // 2024 Data (Current Year - High Volume)
    { id: 13, type: 'PATENT', status: 'ACTIVE', filingDate: '2024-01-05', assignee: 'TechCorp' },
    { id: 14, type: 'PATENT', status: 'PENDING', filingDate: '2024-01-25', assignee: 'Global AI' },
    { id: 15, type: 'TRADEMARK', status: 'PENDING', filingDate: '2024-02-14', assignee: 'BrandX' },
    { id: 16, type: 'PATENT', status: 'ACTIVE', filingDate: '2024-03-01', assignee: 'TechCorp' },
    { id: 17, type: 'PATENT', status: 'PENDING', filingDate: '2024-03-15', assignee: 'InnoSol' },
    { id: 18, type: 'TRADEMARK', status: 'REGISTERED', filingDate: '2024-04-10', assignee: 'Future Systems' },
    { id: 19, type: 'PATENT', status: 'ACTIVE', filingDate: '2024-05-20', assignee: 'TechCorp' },
    { id: 20, type: 'PATENT', status: 'PENDING', filingDate: '2024-06-05', assignee: 'Global AI' },
    { id: 21, type: 'PATENT', status: 'EXPIRED', filingDate: '2024-06-25', assignee: 'OldTech Inc' },
    { id: 22, type: 'PATENT', status: 'ACTIVE', filingDate: '2024-07-10', assignee: 'InnoSol' },
    { id: 23, type: 'TRADEMARK', status: 'PENDING', filingDate: '2024-08-01', assignee: 'BrandX' },
    { id: 24, type: 'PATENT', status: 'PENDING', filingDate: '2024-09-12', assignee: 'Future Systems' },
    { id: 25, type: 'PATENT', status: 'ACTIVE', filingDate: '2024-10-05', assignee: 'TechCorp' },
];

const AnalysisPage = () => {
    // We use MOCK_DATA instead of fetching from API
    const data = MOCK_DATA; 

    // --- 3. DYNAMIC CALCULATIONS ---
    const stats = useMemo(() => {
        const totalAssets = data.length;
        const activeAssets = data.filter(d => d.status === 'ACTIVE' || d.status === 'REGISTERED').length;
        const pendingAssets = data.filter(d => d.status === 'PENDING').length;
        
        // Calculate Growth (2024 vs 2023)
        const thisYearCount = data.filter(d => d.filingDate.startsWith('2024')).length;
        const lastYearCount = data.filter(d => d.filingDate.startsWith('2023')).length;
        const growthRate = lastYearCount > 0 ? ((thisYearCount - lastYearCount) / lastYearCount) * 100 : 100;

        // Top Competitors (Group by Assignee)
        const assigneeMap = {};
        data.forEach(item => {
            assigneeMap[item.assignee] = (assigneeMap[item.assignee] || 0) + 1;
        });
        const topCompetitors = Object.entries(assigneeMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        return { totalAssets, activeAssets, pendingAssets, growthRate, topCompetitors };
    }, [data]);

    // Graph 1: Filing Trends (Group by Year)
    const trendData = useMemo(() => {
        const yearMap = {};
        data.forEach(item => {
            const year = item.filingDate.substring(0, 4);
            if (!yearMap[year]) yearMap[year] = { year, active: 0, pending: 0 };
            
            if (item.status === 'ACTIVE' || item.status === 'REGISTERED') yearMap[year].active++;
            else if (item.status === 'PENDING') yearMap[year].pending++;
        });
        return Object.values(yearMap).sort((a, b) => a.year - b.year);
    }, [data]);

    // Graph 2: Asset Distribution (Type)
    const distributionData = useMemo(() => {
        const typeMap = { 'Patents': 0, 'Trademarks': 0 };
        data.forEach(item => {
            if (item.type === 'PATENT') typeMap['Patents']++;
            else typeMap['Trademarks']++;
        });
        return Object.keys(typeMap).map(key => ({ name: key, value: typeMap[key] }));
    }, [data]);

    return (
        <div className="space-y-8 p-4">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Portfolio Intelligence</h2>
                    <p className="text-slate-500 mt-1">Real-time insights derived from your IP assets.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium shadow-sm transition">
                        Export PDF
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-lg shadow-indigo-200 transition">
                        Share Report
                    </button>
                </div>
            </div>

            {/* 1. KEY METRICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Card 1: Total Assets */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                            <Layers className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
                            Total Assets
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Portfolio Size</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stats?.totalAssets}</h3>
                </div>

                {/* Card 2: Growth */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${stats?.growthRate >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {stats?.growthRate.toFixed(0)}% YoY
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Annual Growth</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stats?.pendingAssets} <span className="text-lg text-slate-400 font-normal">Pending</span></h3>
                </div>

                {/* Card 3: Valuation */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-violet-50 text-violet-600">
                            Estimated
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Est. Valuation</p>
                    <h3 className="text-3xl font-bold text-slate-900">${(stats?.activeAssets * 0.15).toFixed(2)}M</h3>
                </div>

                {/* Card 4: Health */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-600">
                            Health
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Active Ratio</p>
                    <h3 className="text-3xl font-bold text-slate-900">{Math.round((stats?.activeAssets / stats?.totalAssets) * 100)}%</h3>
                </div>
            </div>

            {/* 2. CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Trend Chart */}
                
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Filing Trends</h3>
                            <p className="text-sm text-slate-500">Active vs Pending filings (2022 - 2024)</p>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Legend verticalAlign="top" height={36}/>
                                <Area type="monotone" dataKey="active" name="Active / Registered" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                                <Area type="monotone" dataKey="pending" name="Pending Application" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPending)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Pie Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 w-full text-left relative z-10">Asset Composition</h3>
                    <div className="h-64 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-sm text-slate-500">
                            Dominant Type: <span className="font-bold text-indigo-600">{distributionData.sort((a,b) => b.value - a.value)[0]?.name}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. COMPETITOR & RISK TABLE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Top Competitors */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-slate-900">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold">Top Assignees (Activity)</h3>
                    </div>
                    <div className="space-y-3">
                        {stats?.topCompetitors.map((comp, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-100 shadow-sm">
                                        {idx + 1}
                                    </div>
                                    <span className="font-medium text-slate-700">{comp.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(comp.count / stats.topCompetitors[0].count) * 100}%` }}></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 w-6 text-right">{comp.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Alerts */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <div className="flex items-center gap-2 mb-6 text-slate-900 relative z-10">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold">Critical Action Items</h3>
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex justify-between items-center hover:shadow-sm transition-shadow cursor-pointer">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <p className="text-red-900 font-bold">Expired Assets</p>
                                    <p className="text-red-700/80 text-xs">Renewals overdue &gt; 30 days</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-red-700">{data.filter(d => d.status === 'EXPIRED').length}</span>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex justify-between items-center hover:shadow-sm transition-shadow cursor-pointer">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <p className="text-amber-900 font-bold">Pending Approval</p>
                                    <p className="text-amber-700/80 text-xs">Requires office action response</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-amber-700">{stats?.pendingAssets}</span>
                        </div>
                    </div>

                    <button className="w-full mt-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition active:scale-[0.99]">
                        Generate Risk Report
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AnalysisPage;