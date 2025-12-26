import React, { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, Database, Globe, Crown, Zap, Calendar, Info } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Filters from "../components/Filters";
import OverviewGrid from "../components/OverviewGrid";
import IPAssetPanel from "../components/IPAssetPanel";

const Dashboard = ({ userProfile, searchMode, setSearchMode }) => {
  const [dbPatentCount, setDbPatentCount] = React.useState(0);
  const [dbConnectionStatus, setDbConnectionStatus] = React.useState('checking'); // 'checking', 'connected', 'error'
  const [dbError, setDbError] = React.useState('');

  // Fetch patent count from database on component mount
  React.useEffect(() => {
    const fetchPatentCount = async () => {
      setDbConnectionStatus('checking');
      try {
        console.log('Fetching patent count from backend...');
        const response = await fetch('http://localhost:8080/api/patents/count');
        if (response.ok) {
          const count = await response.json();
          console.log('Patent count received:', count, 'Type:', typeof count);
          // Ensure we set a number, not an object
          const finalCount = typeof count === 'number' ? count : parseInt(count, 10) || 0;
          setDbPatentCount(finalCount);
          setDbConnectionStatus('connected');
          setDbError('');
          console.log('✓ Database connected. Patents found:', finalCount);
        } else {
          console.error('Failed to fetch patent count. Status:', response.status);
          setDbConnectionStatus('error');
          setDbError(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching patent count:', error);
        setDbPatentCount(0);
        setDbConnectionStatus('error');
        setDbError(error.message || 'Cannot connect to backend server');
      }
    };
    fetchPatentCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchPatentCount, 30000);
    return () => clearInterval(interval);
  }, []);
  const [dashboardData, setDashboardData] = useState({
    portfolioValue: "$0",
    portfolioGrowth: "0%",
    activeSubscriptions: 0,
    recentFilings: 0,
    openAlerts: 0,
    geoDistribution: [],
    loading: true,
  });

  /* ---------------- MOCK DATA ---------------- */
  const portfolioGrowthData = [
    { month: "Jan", value: 1000000 },
    { month: "Feb", value: 1050000 },
    { month: "Mar", value: 1100000 },
    { month: "Apr", value: 1080000 },
    { month: "May", value: 1150000 },
    { month: "Jun", value: 1200000 },
  ];

  const filingsData = [
    { month: "Jan", filings: 12 },
    { month: "Feb", filings: 15 },
    { month: "Mar", filings: 18 },
    { month: "Apr", filings: 22 },
    { month: "May", filings: 20 },
    { month: "Jun", filings: 25 },
  ];

  const assetData = [
    { name: "Patents", value: 45, color: "#6366f1" },
    { name: "Trademarks", value: 30, color: "#22c55e" },
    { name: "Copyrights", value: 15, color: "#facc15" },
    { name: "Trade Secrets", value: 10, color: "#f97316" },
  ];

  /* ---------------- FIRESTORE ---------------- */
  useEffect(() => {
    if (!userProfile?.uid) {
      setDashboardData((prev) => ({ ...prev, loading: false }));
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const ref = doc(db, "dashboardData", userProfile.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setDashboardData({
            portfolioValue: data.portfolioValue || "$0",
            portfolioGrowth: data.portfolioGrowth || "0%",
            activeSubscriptions: data.activeSubscriptions || 0,
            recentFilings: data.recentFilings || 0,
            openAlerts: data.openAlerts || 0,
            geoDistribution: data.geoDistribution || [], // Fetch geo data or default to empty
            loading: false,
          });
        } else {
          setDashboardData({
            portfolioValue: "$1.2M",
            portfolioGrowth: "Up 7.5% this quarter",
            activeSubscriptions: 12,
            recentFilings: 45,
            openAlerts: 3,
            geoDistribution: [ // Fallback mock data for map
              { name: "United States", value: 100 },
              { name: "China", value: 50 },
              { name: "Germany", value: 30 },
              { name: "Brazil", value: 20 },
              { name: "India", value: 80 }
            ],
            loading: false,
          });
        }
      } catch {
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [userProfile?.uid]);

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return null;

    try {
      let end;
      if (endDate instanceof Date) {
        end = endDate;
      } else if (endDate?.toDate) {
        end = endDate.toDate();
      } else if (typeof endDate === 'string') {
        end = new Date(endDate);
      } else {
        return null;
      }

      const now = new Date();
      const diffTime = end - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error('Error calculating days remaining:', error);
      return null;
    }
  };

  /* ======================= UI ======================= */
  return (
    <div className="w-full min-h-screen grid grid-cols-1 xl:grid-cols-5 gap-1.5 p-1.5">
      {/* LEFT SECTION - Takes more space */}
      <div className="xl:col-span-4 space-y-1.5">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Welcome back,</p>
          <h1 className="text-3xl font-bold">
            {getTimeGreeting()}, {userProfile?.firstName || "User"}.
          </h1>
          <p className="text-gray-600 mt-1">
            {userProfile?.email} • {userProfile?.company || "IP Platform"}
          </p>

          {userProfile?.emailVerified && (
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm text-green-600 font-medium">
                Verified Account
              </span>
            </div>
          )}

          {/* Search Mode Toggle */}
          <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Search Mode</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSearchMode('api')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${searchMode === 'api'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Globe size={14} />
                <span className="font-medium">API Search</span>
              </button>
              <button
                onClick={() => setSearchMode('local')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${searchMode === 'local'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Database size={14} />
                <span className="font-medium">Local Database</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {searchMode === 'api' 
                ? 'Searching from external patent database API' 
                : dbConnectionStatus === 'connected'
                  ? `Searching from local database (${dbPatentCount} patents stored)`
                  : dbConnectionStatus === 'checking'
                    ? 'Connecting to database...'
                    : `⚠️ Database connection error: ${dbError}`}
            </p>
            {searchMode === 'local' && dbConnectionStatus === 'connected' && dbPatentCount > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">
                  💡 Tip: Search with any keyword or go to search directly to see all {dbPatentCount} patents
                </p>
              </div>
            )}
            {searchMode === 'local' && dbConnectionStatus === 'error' && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 font-semibold mb-1">⚠️ Backend Server Not Running</p>
                <p className="text-xs text-red-600">
                  Please start the backend server:

                </p>
              </div>
            )}
            {searchMode === 'local' && dbConnectionStatus === 'connected' && dbPatentCount === 0 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700 font-semibold mb-1">ℹ️ No Patents in Database</p>
                <p className="text-xs text-yellow-600">
                  Your local database is empty. Try searching with API mode to add patents.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Filters + Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold mb-2 text-sm">Quick Filters</h2>
            <Filters />
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold mb-2 text-sm">Overview</h2>
            <OverviewGrid dashboardData={dashboardData} />
          </div>
        </div>


      </div>

      {/* RIGHT SECTION */}
      <div className="xl:col-span-1 space-y-1.5">
        {/* Portfolio Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-600 text-sm">Portfolio Value</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp size={16} className="text-blue-600" />
            </div>
          </div>

          <p className="text-3xl font-bold mt-2">
            {dashboardData.portfolioValue}
          </p>
          <p className="text-sm text-green-600 font-medium">
            {dashboardData.portfolioGrowth}
          </p>
        </div>

        {/* Asset Distribution */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-bold mb-3">Asset Distribution</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetData} dataKey="value" outerRadius={75}>
                  {assetData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* FULL WIDTH CHARTS SECTION */}
      <div className="xl:col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-1.5">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-bold mb-3 text-sm">Portfolio Growth</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="value" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-bold mb-3 text-sm">Monthly Filings</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="filings" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <IPAssetPanel geoData={dashboardData.geoDistribution} />
      </div>
    </div>
  );
};

export default Dashboard;
