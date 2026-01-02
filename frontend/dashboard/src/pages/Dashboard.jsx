import React, { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, Database, Globe, Crown, Zap, Calendar, Info } from "lucide-react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
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
import StatePatentCount from "../components/StatePatentCount";
import IndiaPatentPanel from "../components/IndiaPatentPanel";

const Dashboard = ({ userProfile, searchMode, setSearchMode }) => {
  const [dbPatentCount, setDbPatentCount] = React.useState(0);
  const [dbConnectionStatus, setDbConnectionStatus] = React.useState('checking'); // 'checking', 'connected', 'error'
  const [dbError, setDbError] = React.useState('');
  
  // State for map location selection
  const [selectedMapState, setSelectedMapState] = React.useState(null);
  
  // State for total registered users
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [usersStatus, setUsersStatus] = React.useState('checking'); // 'checking', 'connected', 'error'
  const [usersError, setUsersError] = React.useState('');
  
  // State for total patent filings
  const [totalPatentFilings, setTotalPatentFilings] = React.useState(0);
  const [filingsStatus, setFilingsStatus] = React.useState('checking');
  const [filingsError, setFilingsError] = React.useState('');

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
  
  // Fetch total users count from Firestore
  React.useEffect(() => {
    const fetchUsersCount = async () => {
      setUsersStatus('checking');
      try {
        console.log('Fetching users count from Firestore...');
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const count = usersSnapshot.size;
        console.log('Users count received:', count);
        setTotalUsers(count);
        setUsersStatus('connected');
        setUsersError('');
        console.log('✓ Firestore connected. Users found:', count);
      } catch (error) {
        console.error('Error fetching users count:', error);
        setTotalUsers(0);
        setUsersStatus('error');
        setUsersError(error.message || 'Cannot connect to Firestore');
      }
    };
    fetchUsersCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUsersCount, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Fetch patent filings count from PostgreSQL
  React.useEffect(() => {
    const fetchPatentFilingsCount = async () => {
      setFilingsStatus('checking');
      try {
        console.log('Fetching patent filings count from backend...');
        const response = await fetch('http://localhost:8080/api/patent-filing/count');
        if (response.ok) {
          const count = await response.json();
          console.log('Patent filings count received:', count);
          const finalCount = typeof count === 'number' ? count : parseInt(count, 10) || 0;
          setTotalPatentFilings(finalCount);
          setFilingsStatus('connected');
          setFilingsError('');
          console.log('✓ Database connected. Patent filings found:', finalCount);
        } else {
          console.error('Failed to fetch patent filings count. Status:', response.status);
          setFilingsStatus('error');
          setFilingsError(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching patent filings count:', error);
        setTotalPatentFilings(0);
        setFilingsStatus('error');
        setFilingsError(error.message || 'Cannot connect to backend server');
      }
    };
    fetchPatentFilingsCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchPatentFilingsCount, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const [dashboardData, setDashboardData] = useState({
    portfolioValue: "$0",
    portfolioGrowth: "0%",
    activeSubscriptions: 0,
    recentFilings: 0,
    openAlerts: 0,
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
            loading: false,
          });
        } else {
          setDashboardData({
            portfolioValue: "$1.2M",
            portfolioGrowth: "Up 7.5% this quarter",
            activeSubscriptions: 12,
            recentFilings: 45,
            openAlerts: 3,
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

  // Handlers for map location selection
  const handleStateChange = (state) => {
    console.log('🗺️ Map: State selected -', state);
    setSelectedMapState(state || null);
  };

  /* ======================= UI ======================= */
  return (
    <div className="w-full min-h-screen space-y-1.5 p-1.5">
      {/* FULL WIDTH WELCOME CARD */}
      <div className="w-full">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
            {/* Left Side - User Info */}
            <div className="flex-1 min-w-0 w-full lg:w-auto">
              <p className="text-base font-semibold text-gray-700">Welcome back,</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getTimeGreeting()}, {userProfile?.firstName || "User"}.
              </h1>
              <p className="text-gray-600 mt-2">
                {userProfile?.email} • {userProfile?.company || "IP Platform"}
              </p>

              {userProfile?.emailVerified && (
                <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-green-50 rounded-lg border border-green-200 inline-flex">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm text-green-700 font-semibold">
                    Verified Account
                  </span>
                </div>
              )}
            </div>

            {/* Right Side - Search Mode - Water Drop Color */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 rounded-2xl shadow-xl border-2 border-cyan-200/50 p-5 hover:shadow-2xl transition-all hover:scale-[1.01]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-base font-bold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent">Search Mode</p>
                  <div className={`w-2.5 h-2.5 rounded-full ${searchMode === 'api' ? 'bg-cyan-500' : 'bg-teal-500'} animate-pulse shadow-lg`}></div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSearchMode('api')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                      searchMode === 'api'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-cyan-50 border border-cyan-200 shadow-sm'
                    }`}
                    title="Search from external patent database API"
                  >
                    <Globe size={18} />
                    <span>API</span>
                  </button>
                  <button
                    onClick={() => setSearchMode('local')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                      searchMode === 'local'
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-teal-50 border border-teal-200 shadow-sm'
                    }`}
                    title={searchMode === 'local' && dbConnectionStatus === 'connected' 
                      ? `Searching from local database (${dbPatentCount} patents stored)`
                      : 'Search from local database'}
                  >
                    <Database size={18} />
                    <span>Local</span>
                  </button>
                </div>

                {/* Compact Status Indicator */}
                <div className="mt-4 pt-3 border-t border-cyan-200/50">
                  {searchMode === 'api' && (
                    <div className="flex items-start gap-2 bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-cyan-200 shadow-sm">
                      <div className="p-1.5 bg-cyan-100 rounded-lg">
                        <Globe size={16} className="text-cyan-600" />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        Searching from external API
                      </p>
                    </div>
                  )}
                  {searchMode === 'local' && dbConnectionStatus === 'connected' && dbPatentCount > 0 && (
                    <div className="flex items-start gap-2 bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-teal-200 shadow-sm">
                      <div className="p-1.5 bg-teal-100 rounded-lg">
                        <Database size={16} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 font-semibold">Local Database</p>
                        <p className="text-xs text-gray-600 mt-0.5">{dbPatentCount} patents stored</p>
                      </div>
                    </div>
                  )}
                  {searchMode === 'local' && dbConnectionStatus === 'checking' && (
                    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-cyan-200 shadow-sm">
                      <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-gray-700 font-medium">Connecting...</p>
                    </div>
                  )}
                  {searchMode === 'local' && dbConnectionStatus === 'error' && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200 shadow-sm">
                      <span className="text-red-600 text-sm">⚠️</span>
                      <p className="text-sm text-red-700 font-medium">Server not running</p>
                    </div>
                  )}
                  {searchMode === 'local' && dbConnectionStatus === 'connected' && dbPatentCount === 0 && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
                      <span className="text-yellow-600 text-sm">ℹ️</span>
                      <p className="text-sm text-yellow-700 font-medium">Database empty</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
        {/* Total Registered Users Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Database size={24} className="text-white" />
            </div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-white">
              {usersStatus === 'checking' ? (
                <span className="text-white/70">...</span>
              ) : usersStatus === 'error' ? (
                <span className="text-white/70">--</span>
              ) : (
                totalUsers.toLocaleString()
              )}
            </p>
            {usersStatus === 'connected' && (
              <CheckCircle size={20} className="text-white/90" />
            )}
          </div>
          
          <h3 className="text-purple-100 text-sm font-medium mt-1">Total Registered Users</h3>
          
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/20">
            {usersStatus === 'connected' ? (
              <p className="text-xs text-white/80 font-medium">
                ● Live from Firestore
              </p>
            ) : usersStatus === 'checking' ? (
              <p className="text-xs text-white/60">Connecting...</p>
            ) : (
              <p className="text-xs text-white/60">
                {usersError || 'Connection failed'}
              </p>
            )}
          </div>
        </div>

        {/* Total Patents Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Database size={24} className="text-white" />
            </div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-white">
              {dbConnectionStatus === 'checking' ? (
                <span className="text-white/70">...</span>
              ) : dbConnectionStatus === 'error' ? (
                <span className="text-white/70">--</span>
              ) : (
                dbPatentCount.toLocaleString()
              )}
            </p>
            {dbConnectionStatus === 'connected' && (
              <CheckCircle size={20} className="text-white/90" />
            )}
          </div>
          
          <h3 className="text-indigo-100 text-sm font-medium mt-1">Total Patents</h3>
          
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/20">
            {dbConnectionStatus === 'connected' ? (
              <p className="text-xs text-white/80 font-medium">
                ● Live from Database
              </p>
            ) : dbConnectionStatus === 'checking' ? (
              <p className="text-xs text-white/60">Connecting...</p>
            ) : (
              <p className="text-xs text-white/60">
                {dbError || 'Connection failed'}
              </p>
            )}
          </div>
        </div>

        {/* Patent Filings Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-white">
              {filingsStatus === 'checking' ? (
                <span className="text-white/70">...</span>
              ) : filingsStatus === 'error' ? (
                <span className="text-white/70">--</span>
              ) : (
                totalPatentFilings.toLocaleString()
              )}
            </p>
            {filingsStatus === 'connected' && (
              <CheckCircle size={20} className="text-white/90" />
            )}
          </div>
          
          <h3 className="text-emerald-100 text-sm font-medium mt-1">Patent Filings</h3>
          
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/20">
            {filingsStatus === 'connected' ? (
              <p className="text-xs text-white/80 font-medium">
                ● Live from PostgreSQL
              </p>
            ) : filingsStatus === 'checking' ? (
              <p className="text-xs text-white/60">Connecting...</p>
            ) : (
              <p className="text-xs text-white/60">
                {filingsError || 'Connection failed'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-1.5">
        {/* Filters + Overview */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-1.5">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold mb-2 text-sm">Quick Filters</h2>
            <Filters />
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold mb-2 text-sm">Overview</h2>
            <OverviewGrid dashboardData={dashboardData} />
          </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1.5">
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
      </div>

      {/* Map and State Patent Count in Single Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* State-wise Patent Count */}
        <div className="flex">
          <StatePatentCount 
            onStateChange={handleStateChange}
          />
        </div>
        
        {/* India Patent Map */}
        <div className="flex">
          <IndiaPatentPanel 
            selectedState={selectedMapState}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
