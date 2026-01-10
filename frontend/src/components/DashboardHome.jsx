import React, { useState, useEffect } from 'react';
import {
  FileText, TrendingUp, Shield, AlertCircle, 
  Search, Plus, Loader2, DollarSign, Activity, BarChart3, Globe
} from 'lucide-react';
import { analyticsAPI } from '../api/analytics';

const DashboardHome = ({ onNavigate, user }) => {
  const currentYear = new Date().getFullYear();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [dbStats, setDbStats] = useState({
    totalPatents: 0, 
    activeFilings: 0, 
    protectedAssets: 0,
    criticalAlerts: 0, 
    portfolioValue: "0.0",
    growth: 0
  });

  useEffect(() => {
    const fetchDashboardContext = async () => {
      setLoading(true);
      try {
        
        const summary = await analyticsAPI.getDashboardSummary({ 
          t: new Date().getTime() 
        });

        setDbStats({
          totalPatents: summary?.totalFilings || 0,
          activeFilings: summary?.pendingApplications || 0,
          protectedAssets: summary?.activePatents || 0,
          criticalAlerts: summary?.expiringSoon || 0,
          portfolioValue: "12.5", 
          growth: 15
        });
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Page load 
    fetchDashboardContext();
}, []);

  const handleSearchNavigation = (e) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      onNavigate('search', localSearchTerm);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 text-sm mt-2">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-900">
      
      <div className="w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {user?.name || 'Authorized User'} • {currentYear}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <form onSubmit={handleSearchNavigation} className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search assets, filings..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </form>

          <button 
            onClick={() => onNavigate('new-filing')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus size={18} /> New Filing
          </button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Patents', value: dbStats.totalPatents, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Filings', value: dbStats.activeFilings, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Protected Assets', value: dbStats.protectedAssets, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Critical Alerts', value: dbStats.criticalAlerts, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{item.label}</p>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`p-4 rounded-xl ${item.bg}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm lg:col-span-2 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Portfolio Valuation</h3>
                  <p className="text-sm text-gray-500">Estimated current market value</p>
                </div>
                <span className="text-sm text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full">+15% Growth</span>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-extrabold text-gray-900">${dbStats.portfolioValue}M</span>
                <span className="text-xl text-gray-500">USD</span>
            </div>
            <div>
                <button 
                    onClick={() => onNavigate('analysis')}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                >
                    View Detailed Analytics <BarChart3 size={18} />
                </button>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">System Status</h3>
              <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                          <Activity className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">Database</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-bold text-green-700">ONLINE</span>
                      </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">Global Sync</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-bold text-green-700">ONLINE</span>
                      </div>
                  </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">All Systems Operational</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;