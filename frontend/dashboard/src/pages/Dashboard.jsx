import React, { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Filters from '../components/Filters';
import OverviewGrid from '../components/OverviewGrid';

const Dashboard = ({ userProfile }) => {
  const [dashboardData, setDashboardData] = useState({
    portfolioValue: '$0',
    portfolioGrowth: '0%',
    activeSubscriptions: 0,
    recentFilings: 0,
    openAlerts: 0,
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userProfile.uid) return;
      
      try {
        console.log('📊 Fetching dashboard data for UID:', userProfile.uid);
        const dashboardDocRef = doc(db, 'dashboardData', userProfile.uid);
        const dashboardDocSnap = await getDoc(dashboardDocRef);
        
        if (dashboardDocSnap.exists()) {
          const data = dashboardDocSnap.data();
          console.log('✅ Dashboard data loaded:', data);
          setDashboardData({
            portfolioValue: data.portfolioValue || '$0',
            portfolioGrowth: data.portfolioGrowth || '0%',
            activeSubscriptions: data.activeSubscriptions || 0,
            recentFilings: data.recentFilings || 0,
            openAlerts: data.openAlerts || 0,
            loading: false
          });
        } else {
          console.log('⚠️ No dashboard data found, using defaults');
          setDashboardData({
            portfolioValue: '$1.2M',
            portfolioGrowth: 'Up 7.5% this quarter',
            activeSubscriptions: 12,
            recentFilings: 45,
            openAlerts: 3,
            loading: false
          });
        }
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [userProfile.uid]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8">

      <div className="bg-white/90 rounded-2xl p-8 shadow-lg">
        <p className="text-sm text-gray-500 mb-1">Welcome back,</p>
        <h1 className="text-4xl font-bold">
          {getTimeGreeting()}, {userProfile.firstName || 'User'}.
        </h1>
        <p className="text-gray-600 mt-2">
          {userProfile.email || 'user@example.com'} • {userProfile.company || 'IP Intelligence Platform'}
        </p>
        {userProfile.emailVerified && (
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Verified Account</span>
          </div>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search patents..."
          className="w-full pl-14 pr-36 py-4 bg-white/90 border border-gray-200 rounded-2xl"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-blue-500 text-white rounded-xl">
          Search
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Quick Filters</h2>
        <Filters />
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Overview</h2>
        <OverviewGrid dashboardData={dashboardData} />
      </div>

      <div className="bg-white/90 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-gray-600 font-semibold">Portfolio Value</h3>
          <div className="p-2 bg-blue-50 rounded-xl">
            <TrendingUp size={16} className="text-blue-600" />
          </div>
        </div>
        <div className="mb-2">
          {dashboardData.loading ? (
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <span className="text-4xl font-bold">{dashboardData.portfolioValue}</span>
          )}
        </div>
        {dashboardData.loading ? (
          <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-sm text-green-600 font-medium">{dashboardData.portfolioGrowth}</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
