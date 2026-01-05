import React, { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, Database, Globe, Crown, Zap, Calendar, Info } from "lucide-react";
import { doc, getDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

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
import QuickSearchKeywords from "../components/QuickSearchKeywords";
import GrowthTrendChart from "../components/GrowthTrendChart";
import Chatbot from "../components/Chatbot";

const Dashboard = ({ userProfile, searchMode, setSearchMode, onSearch, setCurrentPage }) => {
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
  
  // State for yearly patent data
  const [yearlyPatentData, setYearlyPatentData] = React.useState([]);
  const [yearlyDataStatus, setYearlyDataStatus] = React.useState('loading');
  
  // State for subscription revenue data
  const [revenueData, setRevenueData] = React.useState([]);
  const [revenueStatus, setRevenueStatus] = React.useState('loading');
  
  // State for feedback analytics
  const [feedbackStats, setFeedbackStats] = React.useState(null);
  const [feedbackStatus, setFeedbackStatus] = React.useState('loading');
  const [allFeedbacks, setAllFeedbacks] = React.useState([]);
  
  // State for online users
  const [onlineUsers, setOnlineUsers] = React.useState(0);
  
  // Local state for user profile to ensure emailVerified is loaded immediately
  const [localUserProfile, setLocalUserProfile] = React.useState(userProfile);
  
  // Update local profile whenever userProfile prop changes
  React.useEffect(() => {
    if (userProfile) {
      setLocalUserProfile(userProfile);
    }
  }, [userProfile]);
  
  // Fetch emailVerified status immediately on mount
  React.useEffect(() => {
    const fetchEmailVerifiedStatus = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log('🔍 Fetching emailVerified status for user:', currentUser.uid);
        
        // Force reload user to get latest emailVerified status
        await currentUser.reload();
        const emailVerified = currentUser.emailVerified;
        
        console.log('✅ EmailVerified status from Firebase Auth:', emailVerified);
        
        // Also check Firestore for emailVerified
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const firestoreData = userDocSnap.data();
            const firestoreEmailVerified = firestoreData.emailVerified ?? emailVerified;
            
            console.log('✅ EmailVerified status from Firestore:', firestoreEmailVerified);
            
            // Update local user profile with emailVerified status
            setLocalUserProfile(prev => ({
              ...prev,
              emailVerified: firestoreEmailVerified,
              uid: currentUser.uid,
              email: currentUser.email || prev?.email
            }));
          } else {
            // Use Firebase Auth emailVerified if Firestore doc doesn't exist
            setLocalUserProfile(prev => ({
              ...prev,
              emailVerified: emailVerified,
              uid: currentUser.uid,
              email: currentUser.email || prev?.email
            }));
          }
        } catch (error) {
          console.error('❌ Error fetching emailVerified from Firestore:', error);
          // Fallback to Firebase Auth emailVerified
          setLocalUserProfile(prev => ({
            ...prev,
            emailVerified: emailVerified,
            uid: currentUser.uid,
            email: currentUser.email || prev?.email
          }));
        }
      }
    };
    
    fetchEmailVerifiedStatus();
  }, []);

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
  
  // Fetch total users count and subscription revenue from Firestore
  React.useEffect(() => {
    const fetchUsersCount = async () => {
      setUsersStatus('checking');
      setRevenueStatus('loading');
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
        
        // Calculate subscription revenue by date (daily)
        const dailyRevenue = {};
        const PRO_PRICE = 49;
        const ENTERPRISE_PRICE = 199;
        
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          const subscription = userData.subscriptionType?.toLowerCase();
          
          // Get subscription date (use createdAt or subscriptionStartDate)
          let subDate = null;
          if (userData.subscriptionStartDate) {
            subDate = userData.subscriptionStartDate.toDate ? userData.subscriptionStartDate.toDate() : new Date(userData.subscriptionStartDate);
          } else if (userData.createdAt) {
            subDate = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt);
          }
          
          if (subDate && (subscription === 'pro' || subscription === 'enterprise')) {
            // Format date as YYYY-MM-DD for grouping
            const dateKey = subDate.toISOString().split('T')[0];
            const displayDate = subDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            if (!dailyRevenue[dateKey]) {
              dailyRevenue[dateKey] = { 
                date: displayDate, 
                value: 0, 
                fullDate: subDate,
                proUsers: 0,
                enterpriseUsers: 0,
                totalUsers: 0
              };
            }
            
            const amount = subscription === 'pro' ? PRO_PRICE : ENTERPRISE_PRICE;
            dailyRevenue[dateKey].value += amount;
            dailyRevenue[dateKey].totalUsers += 1;
            
            if (subscription === 'pro') {
              dailyRevenue[dateKey].proUsers += 1;
            } else if (subscription === 'enterprise') {
              dailyRevenue[dateKey].enterpriseUsers += 1;
            }
          }
        });
        
        // Convert to array and sort by date
        const revenueArray = Object.values(dailyRevenue)
          .sort((a, b) => a.fullDate - b.fullDate)
          .slice(-30) // Get last 30 days
          .map(item => ({ 
            date: item.date, 
            value: item.value,
            proUsers: item.proUsers,
            enterpriseUsers: item.enterpriseUsers,
            totalUsers: item.totalUsers
          }));
        
        // If no revenue data, create empty structure for last 30 days
        if (revenueArray.length === 0) {
          const now = new Date();
          const emptyData = [];
          for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            emptyData.push({ 
              date: displayDate, 
              value: 0,
              proUsers: 0,
              enterpriseUsers: 0,
              totalUsers: 0
            });
          }
          setRevenueData(emptyData);
        } else {
          setRevenueData(revenueArray);
        }
        
        setRevenueStatus('success');
        console.log('✓ Revenue data calculated:', revenueArray);
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
  
  // Real-time listener for online users
  React.useEffect(() => {
    console.log('Setting up real-time listener for online users...');
    
    const usersCollection = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      let onlineCount = 0;
      
      snapshot.forEach((doc) => {
        const userData = doc.data();
        
        // Primary check: isOnline flag (set on login, cleared on logout)
        // Fallback: if isOnline is undefined/null, check lastLogin within 5 minutes (for backward compatibility)
        let isCurrentlyLoggedIn = false;
        
        if (userData.isOnline !== undefined && userData.isOnline !== null) {
          // Use explicit isOnline flag if available
          isCurrentlyLoggedIn = userData.isOnline === true;
        } else {
          // Fallback to time-based check for older user records
          const lastLogin = userData.lastLogin?.toDate?.() || (userData.lastLogin ? new Date(userData.lastLogin) : null);
          isCurrentlyLoggedIn = lastLogin && (new Date() - lastLogin) < 5 * 60 * 1000;
        }
        
        if (isCurrentlyLoggedIn) {
          onlineCount++;
        }
      });
      
      console.log('Real-time online users update:', onlineCount);
      setOnlineUsers(onlineCount);
    }, (error) => {
      console.error('Error in real-time listener:', error);
    });

    return () => {
      console.log('Cleaning up real-time listener for online users');
      unsubscribe();
    };
  }, []);
  
  // Fetch feedback analytics
  React.useEffect(() => {
    const fetchFeedbackAnalytics = async () => {
      setFeedbackStatus('loading');
      try {
        console.log('Fetching feedback analytics from backend...');
        
        // Fetch stats
        const statsResponse = await fetch('http://localhost:8080/api/feedback/stats');
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          console.log('Feedback stats received:', stats);
          setFeedbackStats(stats);
        }
        
        // Fetch all feedbacks
        const allResponse = await fetch('http://localhost:8080/api/feedback/all');
        if (allResponse.ok) {
          const feedbacks = await allResponse.json();
          console.log('All feedbacks received:', feedbacks.length);
          setAllFeedbacks(feedbacks);
        }
        
        setFeedbackStatus('success');
      } catch (error) {
        console.error('Error fetching feedback analytics:', error);
        setFeedbackStatus('error');
      }
    };
    
    fetchFeedbackAnalytics();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchFeedbackAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Fetch yearly patent counts for chart
  React.useEffect(() => {
    const fetchYearlyPatentData = async () => {
      setYearlyDataStatus('loading');
      try {
        console.log('Fetching yearly patent data from backend...');
        const response = await fetch('http://localhost:8080/api/patents/yearly-counts');
        if (response.ok) {
          const data = await response.json();
          console.log('Yearly patent data received:', data);
          
          // Get current year
          const currentYear = new Date().getFullYear();
          
          // Create a map from the backend data
          const dataMap = {};
          data.forEach(item => {
            dataMap[item.year] = item.count;
          });
          
          // Generate data for last 7 years (current year + previous 6 years)
          const yearlyData = [];
          for (let i = 6; i >= 0; i--) {
            const year = currentYear - i;
            yearlyData.push({
              year: year.toString(),
              patents: dataMap[year] || 0
            });
          }
          
          console.log('Processed yearly data:', yearlyData);
          setYearlyPatentData(yearlyData);
          setYearlyDataStatus('success');
        } else {
          console.error('Failed to fetch yearly patent data. Status:', response.status);
          setYearlyDataStatus('error');
        }
      } catch (error) {
        console.error('Error fetching yearly patent data:', error);
        setYearlyDataStatus('error');
      }
    };
    
    fetchYearlyPatentData();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchYearlyPatentData, 60000);
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

  /* ---------------- SUBSCRIPTION REVENUE DATA ---------------- */
  // Revenue data will be fetched from Firebase based on subscription counts

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

  // Handler for quick search keywords
  const handleSearch = (keyword) => {
    if (onSearch && setCurrentPage) {
      onSearch(keyword);
      setCurrentPage('search');
    }
  };

  /* ======================= UI ======================= */
  return (
    <div className="w-full min-h-screen space-y-1.5 p-1.5">
      {/* QUICK SEARCH KEYWORDS - Top of page */}
      <QuickSearchKeywords 
        onSearch={handleSearch}
        setSearchMode={setSearchMode}
      />
      
      {/* FULL WIDTH WELCOME CARD */}
      <div className="w-full">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
            {/* Left Side - User Info */}
            <div className="flex-1 min-w-0 w-full lg:w-auto">
              <p className="text-base font-semibold text-gray-700">Welcome back,</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getTimeGreeting()}, {localUserProfile?.firstName || userProfile?.firstName || "User"}.
              </h1>
              <p className="text-gray-600 mt-2">
                {localUserProfile?.email || userProfile?.email} • {localUserProfile?.company || userProfile?.company || "IP Platform"}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                {localUserProfile?.emailVerified && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm text-green-700 font-semibold">
                      Verified Account
                    </span>
                  </div>
                )}
                
                {/* Online Users Count */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-700 font-medium">
                    <span className="font-bold text-green-600">{onlineUsers}</span> Online {onlineUsers === 1 ? 'User' : 'Users'}
                  </span>
                </div>
              </div>
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

      {/* GROWTH TREND CHART */}
      <div className="w-full">
        <GrowthTrendChart
          totalUsers={totalUsers}
          dbPatentCount={dbPatentCount}
          totalPatentFilings={totalPatentFilings}
          usersStatus={usersStatus}
          dbConnectionStatus={dbConnectionStatus}
          filingsStatus={filingsStatus}
        />
      </div>

      {/* FULL WIDTH CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 shadow-lg border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-indigo-900">Subscription Revenue</h3>
            {revenueStatus === 'loading' && (
              <div className="text-xs text-indigo-600 animate-pulse">Loading...</div>
            )}
            {revenueStatus === 'success' && (
              <div className="text-xs text-indigo-700 font-medium">● Live Data</div>
            )}
          </div>
          <p className="text-sm text-indigo-700 mb-4">Daily revenue from Pro (₹49) & Enterprise (₹199) subscriptions</p>
          <div className="h-[280px]">
            {revenueStatus === 'loading' ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-indigo-600">Loading revenue data...</div>
              </div>
            ) : revenueData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-indigo-600">No subscription revenue data available</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#4f46e5"
                    style={{ fontSize: '12px', fontWeight: '600' }}
                  />
                  <YAxis 
                    stroke="#4f46e5"
                    style={{ fontSize: '12px', fontWeight: '600' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#eef2ff',
                      border: '2px solid #6366f1',
                      borderRadius: '8px',
                      fontWeight: '600',
                      padding: '12px'
                    }}
                    labelStyle={{ color: '#4f46e5', fontWeight: 'bold', marginBottom: '8px' }}
                    formatter={(value, name, props) => {
                      const { payload } = props;
                      return [
                        <div key="tooltip-revenue" className="space-y-2">
                          <div className="text-indigo-900 font-bold text-base">₹{value}</div>
                          <div className="text-sm space-y-1">
                            {payload.proUsers > 0 && (
                              <div className="text-indigo-700">
                                <span className="font-semibold">Pro:</span> {payload.proUsers} user{payload.proUsers !== 1 ? 's' : ''}
                              </div>
                            )}
                            {payload.enterpriseUsers > 0 && (
                              <div className="text-purple-700">
                                <span className="font-semibold">Enterprise:</span> {payload.enterpriseUsers} user{payload.enterpriseUsers !== 1 ? 's' : ''}
                              </div>
                            )}
                            {payload.totalUsers === 0 && (
                              <div className="text-gray-500 italic">No upgrades this day</div>
                            )}
                          </div>
                        </div>
                      ];
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="url(#revenueGradient)" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 5 }}
                    activeDot={{ r: 7, stroke: '#6366f1', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-emerald-900">Yearly Patent Trends</h3>
            {yearlyDataStatus === 'loading' && (
              <div className="text-xs text-emerald-600 animate-pulse">Loading...</div>
            )}
            {yearlyDataStatus === 'success' && (
              <div className="text-xs text-emerald-700 font-medium">● Live Data</div>
            )}
          </div>
          <p className="text-sm text-emerald-700 mb-4">Patent count by year (Last 7 years)</p>
          <div className="h-[280px]">
            {yearlyDataStatus === 'loading' ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-emerald-600">Loading yearly data...</div>
              </div>
            ) : yearlyPatentData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-emerald-600">No patent data available</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyPatentData}>
                  <defs>
                    <linearGradient id="patentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis 
                    dataKey="year" 
                    stroke="#047857"
                    style={{ fontSize: '12px', fontWeight: '600' }}
                  />
                  <YAxis 
                    stroke="#047857"
                    style={{ fontSize: '12px', fontWeight: '600' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ecfdf5',
                      border: '2px solid #10b981',
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}
                    labelStyle={{ color: '#047857' }}
                  />
                  <Bar 
                    dataKey="patents" 
                    fill="url(#patentGradient)"
                    radius={[8, 8, 0, 0]}
                    name="Patents"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Map and State Patent Count in Single Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
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

      {/* FEEDBACK ANALYTICS SECTION - Moved to bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1.5 mt-1.5">
        {/* Average Ratings by Category - Left Side (2/3 width) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-blue-900">User Feedback Ratings</h3>
            {feedbackStatus === 'loading' && (
              <div className="text-xs text-blue-600 animate-pulse">Loading...</div>
            )}
            {feedbackStatus === 'success' && (
              <div className="text-xs text-blue-700 font-medium">● Live Data</div>
            )}
          </div>
          <p className="text-sm text-blue-700 mb-4">Average ratings across all categories (Scale: 0-5)</p>
          <div className="h-[320px] px-4">
            {feedbackStatus === 'loading' ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-blue-600">Loading feedback data...</div>
              </div>
            ) : !feedbackStats || feedbackStats.totalFeedbacks === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-blue-600">No feedback data available</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { category: 'UI', rating: feedbackStats.averageUIRating || 0, fullName: 'User Interface' },
                  { category: 'Performance', rating: feedbackStats.averagePerformanceRating || 0, fullName: 'Performance' },
                  { category: 'Features', rating: feedbackStats.averageFeaturesRating || 0, fullName: 'Features' },
                  { category: 'Support', rating: feedbackStats.averageSupportRating || 0, fullName: 'Support' },
                  { category: 'Overall', rating: feedbackStats.averageOverallRating || 0, fullName: 'Overall Experience' }
                ]} layout="vertical">
                  <defs>
                    <linearGradient id="ratingGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                  <XAxis 
                    type="number" 
                    domain={[0, 5]}
                    stroke="#1e40af"
                    style={{ fontSize: '13px', fontWeight: '700' }}
                    tick={{ fill: '#1e3a8a' }}
                    tickCount={6}
                  />
                  <YAxis 
                    type="category"
                    dataKey="category" 
                    stroke="#1e40af"
                    width={110}
                    style={{ fontSize: '14px', fontWeight: '700' }}
                    tick={{ fill: '#1e3a8a' }}
                    orientation="left"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#eff6ff',
                      border: '2px solid #3b82f6',
                      borderRadius: '8px',
                      fontWeight: '600',
                      padding: '12px'
                    }}
                    labelStyle={{ color: '#1e40af', fontWeight: 'bold' }}
                    formatter={(value, name, props) => {
                      return [
                        <div key="tooltip-rating" className="space-y-1">
                          <div className="text-blue-900 font-bold">{props.payload.fullName}</div>
                          <div className="text-lg text-blue-700">{value.toFixed(2)} / 5.00</div>
                          <div className="text-sm text-blue-600">
                            {value >= 4.5 ? '⭐ Excellent' : value >= 4 ? '✨ Very Good' : value >= 3 ? '👍 Good' : value >= 2 ? '😐 Fair' : '⚠️ Needs Improvement'}
                          </div>
                        </div>
                      ];
                    }}
                  />
                  <Bar 
                    dataKey="rating" 
                    fill="url(#ratingGradient)"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Feedback Overview - Right Side (1/3 width) */}
        {feedbackStatus === 'success' && feedbackStats && (
          <div className="lg:col-span-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 shadow-lg border border-purple-100">
            <h3 className="font-bold text-lg text-purple-900 mb-4">Feedback Overview</h3>
            <div className="space-y-4">
              {/* Total Feedbacks */}
              <div className="bg-white/60 rounded-lg p-4 border border-purple-200">
                <div className="text-sm text-purple-600 font-medium mb-1">Total Feedbacks</div>
                <div className="text-3xl font-bold text-purple-900">{feedbackStats.totalFeedbacks || 0}</div>
              </div>

              {/* Overall Average Rating */}
              <div className="bg-white/60 rounded-lg p-4 border border-purple-200">
                <div className="text-sm text-purple-600 font-medium mb-1">Overall Average</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-purple-900">
                    {feedbackStats.overallAverageRating ? feedbackStats.overallAverageRating.toFixed(2) : '0.00'}
                  </div>
                  <div className="text-lg text-purple-600">/ 5.00</div>
                </div>
                <div className="mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`text-2xl ${
                        star <= Math.round(feedbackStats.overallAverageRating || 0) 
                          ? 'text-yellow-500' 
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Sentiment Indicator */}
              <div className="bg-white/60 rounded-lg p-4 border border-purple-200">
                <div className="text-sm text-purple-600 font-medium mb-2">User Sentiment</div>
                <div className="text-center">
                  {feedbackStats.overallAverageRating >= 4.5 && (
                    <div className="text-4xl mb-1">😊</div>
                  )}
                  {feedbackStats.overallAverageRating >= 4 && feedbackStats.overallAverageRating < 4.5 && (
                    <div className="text-4xl mb-1">🙂</div>
                  )}
                  {feedbackStats.overallAverageRating >= 3 && feedbackStats.overallAverageRating < 4 && (
                    <div className="text-4xl mb-1">😐</div>
                  )}
                  {feedbackStats.overallAverageRating < 3 && feedbackStats.overallAverageRating > 0 && (
                    <div className="text-4xl mb-1">😟</div>
                  )}
                  {feedbackStats.overallAverageRating === 0 && (
                    <div className="text-4xl mb-1">📊</div>
                  )}
                  <div className="text-xs text-purple-700 font-medium">
                    {feedbackStats.overallAverageRating >= 4.5 ? 'Excellent' : 
                     feedbackStats.overallAverageRating >= 4 ? 'Very Good' :
                     feedbackStats.overallAverageRating >= 3 ? 'Good' :
                     feedbackStats.overallAverageRating > 0 ? 'Needs Improvement' : 'No Ratings Yet'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Overview - Moved to bottom above recent feedback */}
      {feedbackStatus === 'success' && feedbackStats && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 shadow-lg border border-amber-100 mt-1.5">
          <h3 className="font-bold text-lg text-amber-900 mb-4">Recent User Feedback</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFeedbacks.slice(-3).reverse().map((feedback) => (
              <div key={feedback.id} className="bg-white/70 rounded-lg p-4 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-semibold text-amber-900">
                    {feedback.userName || 'Anonymous User'}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="text-sm font-bold text-amber-700">
                      {feedback.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>
                
                {feedback.feedbackMessage && (
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3 italic">
                    "{feedback.feedbackMessage}"
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">UI:</span>
                    <span className="font-semibold text-blue-700">{feedback.userInterfaceRating || 0}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Perf:</span>
                    <span className="font-semibold text-green-700">{feedback.performanceRating || 0}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Features:</span>
                    <span className="font-semibold text-purple-700">{feedback.featuresRating || 0}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Support:</span>
                    <span className="font-semibold text-pink-700">{feedback.supportRating || 0}/5</span>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-amber-200">
                  <div className="text-xs text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Chatbot Component */}
      <Chatbot userId={userProfile?.uid} userProfile={userProfile} />
    </div>
  );
};

export default Dashboard;
