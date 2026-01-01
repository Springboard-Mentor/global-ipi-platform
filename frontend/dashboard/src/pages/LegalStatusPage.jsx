import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, TrendingUp, Award, AlertCircle } from 'lucide-react';

const LegalStatusPage = ({ userProfile, onNavigateToPatentFiling }) => {
  const [stats, setStats] = useState({
    total: 0,
    granted: 0,
    rejected: 0,
    underReview: 0,
    loading: true
  });

  useEffect(() => {
    fetchPatentStats();
  }, []);

  const fetchPatentStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      // Fetch all patents from the system (same endpoint as Admin Panel)
      const response = await fetch('http://localhost:8080/api/patent-filing/all', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (response.ok) {
        const patents = await response.json();
        
        console.log('Legal Status - Fetched patents:', patents);
        console.log('Legal Status - Total patents:', patents.length);
        
        // Calculate statistics (same logic as Admin Panel)
        const total = patents.length;
        const granted = patents.filter(p => p.stage5Granted === true).length;
        const rejected = patents.filter(p => {
          console.log(`Patent ${p.id} status:`, p.status);
          return p.status === 'Patent is Rejected';
        }).length;
        
        const underReview = total - granted - rejected;
        
        console.log('Legal Status - Stats:', { total, granted, rejected, underReview });
        
        setStats({
          total,
          granted,
          rejected,
          underReview,
          loading: false
        });
      } else {
        console.error('Failed to fetch patent statistics');
        setStats({
          total: 0,
          granted: 0,
          rejected: 0,
          underReview: 0,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching patent statistics:', error);
      setStats({
        total: 0,
        granted: 0,
        rejected: 0,
        underReview: 0,
        loading: false
      });
    }
  };

  const StatCard = ({ title, value, icon: Icon, gradient, iconBg, iconColor, description }) => (
    <div className="relative group">
      {/* Animated background glow */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500`}></div>
      
      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-transparent overflow-hidden">
        {/* Gradient top border */}
        <div className={`h-1.5 bg-gradient-to-r ${gradient}`}></div>
        
        {/* Card Content */}
        <div className="p-8">
          {/* Header with Icon */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {title}
              </p>
              {stats.loading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  <span className="text-gray-400 text-lg font-medium">Loading...</span>
                </div>
              ) : (
                <h3 className="text-5xl font-black text-gray-900 tracking-tight">
                  {value.toLocaleString()}
                </h3>
              )}
            </div>
            
            {/* Icon */}
            <div className={`${iconBg} p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
              <Icon className={`w-8 h-8 ${iconColor}`} strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            {description}
          </p>
          
          {/* Progress Bar */}
          {!stats.loading && stats.total > 0 && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">Status Overview</span>
                <span className="text-xs font-bold text-gray-700">
                  {title === 'Total Patents' 
                    ? '100%' 
                    : `${Math.round((value / stats.total) * 100)}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-2.5 bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                  style={{ 
                    width: title === 'Total Patents' 
                      ? '100%' 
                      : `${(value / stats.total) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Decorative corner accent */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full`}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Legal Status Dashboard
              </h1>
              <p className="text-gray-600 text-lg mt-1 font-medium">
                Monitor your patent portfolio and legal status
              </p>
            </div>
          </div>
          
          {/* System-wide Badge - Top Right */}
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">
              System-wide Patent Statistics
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <StatCard
          title="Total Patents"
          value={stats.total}
          icon={FileText}
          gradient="from-blue-500 via-indigo-500 to-purple-600"
          iconBg="bg-gradient-to-br from-blue-100 to-indigo-100"
          iconColor="text-blue-600"
          description="Total number of patent applications filed through the platform"
        />
        
        <StatCard
          title="Granted Patents"
          value={stats.granted}
          icon={CheckCircle}
          gradient="from-green-500 via-emerald-500 to-teal-600"
          iconBg="bg-gradient-to-br from-green-100 to-emerald-100"
          iconColor="text-green-600"
          description="Successfully granted patents with full legal protection and rights"
        />
        
        <StatCard
          title="Rejected Patents"
          value={stats.rejected}
          icon={XCircle}
          gradient="from-red-500 via-rose-500 to-pink-600"
          iconBg="bg-gradient-to-br from-red-100 to-rose-100"
          iconColor="text-red-600"
          description="Patent applications that were rejected during the review process"
        />
        
        <StatCard
          title="Under Review"
          value={stats.underReview}
          icon={AlertCircle}
          gradient="from-yellow-500 via-orange-500 to-amber-600"
          iconBg="bg-gradient-to-br from-yellow-100 to-orange-100"
          iconColor="text-yellow-600"
          description="Patent applications currently under review and pending decision"
        />
      </div>

      {/* Additional Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Success Rate Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Success Rate</h3>
          </div>
          
          {!stats.loading && stats.total > 0 ? (
            <div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {Math.round(((stats.total - stats.rejected) / stats.total) * 100)}%
                </span>
                <span className="text-lg text-gray-500 font-semibold">success rate</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {stats.total - stats.rejected} out of {stats.total} patent applications have not been rejected, 
                demonstrating strong application quality and review success.
              </p>
            </div>
          ) : stats.loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No data available yet. File your first patent to see statistics.</p>
          )}
        </div>

        {/* Portfolio Health Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Portfolio Health</h3>
          </div>
          
          {!stats.loading && stats.total > 0 ? (
            <div className="space-y-4">
              {/* Granted */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Active Patents</span>
                  <span className="text-sm font-bold text-green-600">{stats.granted}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(stats.granted / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Rejected */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Rejected</span>
                  <span className="text-sm font-bold text-red-600">{stats.rejected}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Pending */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Under Review</span>
                  <span className="text-sm font-bold text-yellow-600">{stats.total - stats.granted - stats.rejected}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000"
                    style={{ width: `${((stats.total - stats.granted - stats.rejected) / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : stats.loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Portfolio analysis will appear once you have filed patents.</p>
          )}
        </div>
      </div>

      {/* Quick Actions or Tips */}
      <div className="mt-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Protect Your Innovation</h3>
            <p className="text-indigo-100 text-lg leading-relaxed mb-4">
              Track the legal status of your patents in real-time. Monitor approvals, rejections, and pending applications 
              all in one comprehensive dashboard.
            </p>
            <button 
              onClick={onNavigateToPatentFiling}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              File New Patent Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalStatusPage;
