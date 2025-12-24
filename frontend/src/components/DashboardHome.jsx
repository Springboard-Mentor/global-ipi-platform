import React from 'react';
import {
  FileText,
  TrendingUp,
  Shield,
  AlertCircle,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';

const DashboardHome = ({ onNavigate, user }) => {
  const currentYear = new Date().getFullYear();

  /* ===================== DATA ===================== */

  const stats = [
    { label: 'Total Patents', value: '124', trend: 'up', icon: FileText },
    { label: 'Active Filings', value: '32', trend: 'up', icon: TrendingUp },
    { label: 'Protected Assets', value: '89', trend: 'up', icon: Shield },
    { label: 'Critical Alerts', value: '3', trend: 'down', icon: AlertCircle }
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Patent Application Filed',
      description: 'US Patent #2025-12345 - AI Optimization System',
      time: '2 hours ago',
      status: 'success',
      icon: CheckCircle
    },
    {
      id: 2,
      title: 'Infringement Alert',
      description: 'Potential EU market violation detected',
      time: '5 hours ago',
      status: 'warning',
      icon: AlertCircle
    },
    {
      id: 3,
      title: 'Patent Rejected',
      description: 'JP Patent requires revision',
      time: '2 days ago',
      status: 'error',
      icon: XCircle
    }
  ];

  const globalCoverage = [
    { region: 'North America', percent: 85 },
    { region: 'Europe', percent: 70 },
    { region: 'Asia Pacific', percent: 60 },
    { region: 'Latin America', percent: 35 }
  ];

  const deadlines = [
    { task: 'Office Action Response', date: 'Jan 20, 2025', priority: 'High' },
    { task: 'Maintenance Fee', date: 'Jan 25, 2025', priority: 'Medium' },
    { task: 'PCT Entry', date: 'Feb 05, 2025', priority: 'High' }
  ];

  /* ===================== UI ===================== */

  return (
    <div className="space-y-10">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
        <button
          onClick={() => onNavigate('new-filing')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Filing
        </button>
      </div>

      {/* ===== WELCOME ===== */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <p className="text-lg">
          Welcome back bhuvana👋
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          Protect your ideas. Turn innovation into ownership.
        </h1>
        <p className="mt-3 opacity-90 max-w-xl">
          Track patents, monitor filings, and manage global IP assets confidently in {currentYear}.
        </p>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          const Trend = s.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={i} className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex justify-between">
                <Icon className="w-6 h-6 text-indigo-600" />
                <Trend className={`w-4 h-4 ${s.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <p className="mt-4 text-sm text-slate-600">{s.label}</p>
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* ===== PORTFOLIO VALUE ===== */}
      <div className="bg-indigo-600 text-white rounded-xl p-6 flex justify-between items-center">
        <div>
          <p className="text-sm opacity-80">Total Portfolio Value</p>
          <p className="text-4xl font-bold mt-1">$2.4M</p>
          <p className="text-sm opacity-80 mt-1">+15% growth this quarter</p>
        </div>
        <DollarSign className="w-14 h-14 opacity-30" />
      </div>

      {/* ===== ACTIVITY + SIDE ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map(a => {
              const Icon = a.icon;
              return (
                <div key={a.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50">
                  <Icon className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-sm text-slate-600">{a.description}</p>
                    <p className="text-xs text-slate-500 mt-1">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">

          {/* Coverage */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" /> Global Coverage
            </h3>
            {globalCoverage.map((g, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-sm">
                  <span>{g.region}</span>
                  <span>{g.percent}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded">
                  <div className="h-2 bg-indigo-600 rounded" style={{ width: `${g.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Deadlines */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Upcoming Deadlines
            </h3>
            {deadlines.map((d, i) => (
              <div key={i} className="mb-3">
                <p className="text-sm font-medium">{d.task}</p>
                <p className="text-xs text-slate-500">{d.date} • {d.priority}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ===== QUICK ACTION ===== */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Analyze Your IP Portfolio</h3>
          <p className="opacity-90 mt-1">AI-powered insights for smarter decisions</p>
        </div>
        <button className="bg-white text-indigo-600 px-5 py-3 rounded-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          View Analytics
        </button>
      </div>

    </div>
  );
};

export default DashboardHome;
