// src/components/DashboardHome.jsx
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
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Filter
} from 'lucide-react';

// We accept 'onNavigate' as a prop so buttons can switch pages
const DashboardHome = ({ onNavigate }) => {
  // Current year for display
  const currentYear = 2025;

  // --- HARDCODED DATA SECTIONS ---

  const stats = [
    {
      label: 'Total Patents',
      value: '124',
      change: '+12',
      changePercent: '+10.7%',
      trend: 'up',
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Active Filings',
      value: '32',
      change: '+8',
      changePercent: '+33.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Protected Assets',
      value: '89',
      change: '+5',
      changePercent: '+5.9%',
      trend: 'up',
      icon: Shield,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      label: 'Critical Alerts',
      value: '3',
      change: '-2',
      changePercent: '-40%',
      trend: 'down',
      icon: AlertCircle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Patent Application Filed',
      description: 'US Patent #2025-12345 - AI-Driven Optimization System',
      time: '2 hours ago',
      date: 'Jan 15, 2025',
      status: 'success',
      icon: CheckCircle
    },
    {
      id: 2,
      title: 'Infringement Alert Detected',
      description: 'Potential violation detected in EU market - Patent EP3456789',
      time: '5 hours ago',
      date: 'Jan 15, 2025',
      status: 'warning',
      icon: AlertCircle
    },
    {
      id: 3,
      title: 'Patent Granted',
      description: 'CN Patent #CN2024-98765 approved by CNIPA',
      time: '1 day ago',
      date: 'Jan 14, 2025',
      status: 'success',
      icon: CheckCircle
    },
    {
      id: 4,
      title: 'Application Rejected',
      description: 'JP Patent #JP2024-54321 - Revision required by JPO',
      time: '2 days ago',
      date: 'Jan 13, 2025',
      status: 'error',
      icon: XCircle
    },
    {
      id: 5,
      title: 'Deadline Approaching',
      description: 'Response due for Office Action - US20240001234',
      time: '3 days ago',
      date: 'Jan 12, 2025',
      status: 'warning',
      icon: Clock
    }
  ];

  const globalCoverage = [
    { region: 'North America', patents: 45, percentage: 85, countries: 'US, CA, MX' },
    { region: 'Europe', patents: 38, percentage: 70, countries: 'UK, DE, FR, IT' },
    { region: 'Asia Pacific', patents: 28, percentage: 60, countries: 'CN, JP, KR, IN' },
    { region: 'Latin America', patents: 13, percentage: 35, countries: 'BR, AR, CL' }
  ];

  const upcomingDeadlines = [
    { task: 'Office Action Response', patent: 'US20240001234', date: 'Jan 20, 2025', priority: 'high' },
    { task: 'Maintenance Fee Payment', patent: 'EP3456789', date: 'Jan 25, 2025', priority: 'medium' },
    { task: 'PCT National Phase Entry', patent: 'PCT/US2024/12345', date: 'Feb 05, 2025', priority: 'high' },
    { task: 'Annuity Payment', patent: 'GB2345678', date: 'Feb 15, 2025', priority: 'low' }
  ];

  const portfolioValue = {
    total: '$2.4M',
    growth: '+15.3%',
    monthlyChange: '$320K'
  };

  // --- RENDER COMPONENT ---

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your IP portfolio in {currentYear}.</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          
          {/* ✅ FIXED: Added onNavigate logic here */}
          <button 
            onClick={() => onNavigate && onNavigate('new-filing')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition text-sm font-medium shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New Filing
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  {stat.changePercent}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} this month
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Portfolio Value Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm font-medium">Total Portfolio Value</p>
            <p className="text-4xl font-bold mt-2">{portfolioValue.total}</p>
            <p className="text-indigo-100 text-sm mt-2">
              <span className="font-semibold text-white">{portfolioValue.growth}</span> growth this quarter
            </p>
          </div>
          <div className="p-4 bg-white bg-opacity-20 rounded-xl">
            <DollarSign className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* 4. Main Content Grid (Activity + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                const statusColors = {
                  success: 'text-green-600 bg-green-50',
                  warning: 'text-yellow-600 bg-yellow-50',
                  error: 'text-red-600 bg-red-50'
                };
                
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-200">
                    <div className={`p-2 rounded-lg ${statusColors[activity.status]} flex-shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-xs text-slate-500">{activity.time}</p>
                        <span className="text-xs text-slate-400">•</span>
                        <p className="text-xs text-slate-500">{activity.date}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (Coverage + Deadlines) */}
        <div className="space-y-6">
          
          {/* Global Coverage */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">Global Coverage</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                {globalCoverage.map((region, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-medium text-slate-700">{region.region}</span>
                        <p className="text-xs text-slate-500 mt-0.5">{region.countries}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{region.patents}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${region.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">Upcoming Deadlines</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => {
                  const priorityColors = {
                    high: 'bg-red-100 text-red-700',
                    medium: 'bg-yellow-100 text-yellow-700',
                    low: 'bg-green-100 text-green-700'
                  };
                  
                  return (
                    <div key={index} className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{deadline.task}</p>
                        <p className="text-xs text-slate-500 mt-1">{deadline.patent}</p>
                        <p className="text-xs text-slate-600 mt-1">{deadline.date}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[deadline.priority]}`}>
                        {deadline.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Quick Actions Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Need Help Managing Your IP Portfolio?</h3>
            <p className="text-indigo-100">Our AI-powered tools can help you analyze, protect, and optimize your intellectual property assets across {currentYear} and beyond.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition text-sm font-semibold shadow-lg hover:shadow-xl whitespace-nowrap">
              Schedule Consultation
            </button>
            <button className="px-6 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
              <BarChart3 className="w-4 h-4" />
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;