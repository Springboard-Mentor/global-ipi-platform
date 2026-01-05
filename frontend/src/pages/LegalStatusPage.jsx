import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, TrendingUp, Award, AlertCircle, Users, UserCheck, UserX, Filter, X, Search, Globe } from 'lucide-react';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getSearchCounters, getGlobalSearchStats } from '../utils/searchCounters';
import IndiaPatentPanel from '../components/IndiaPatentPanel';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const LegalStatusPage = ({ userProfile, onNavigateToPatentFiling }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    granted: 0,
    rejected: 0,
    underReview: 0,
    loading: true
  });

  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    basicUsers: 0,
    proUsers: 0,
    enterpriseUsers: 0,
    activeUsers: 0,
    deactivatedUsers: 0,
    onlineUsers: 0,
    loading: true
  });

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    year: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [availableFilters, setAvailableFilters] = useState({
    years: []
  });

  const [searchCounters, setSearchCounters] = useState({
    apiSearchCount: 0,
    localSearchCount: 0,
    totalSearchCount: 0,
    loading: true
  });

  const [globalSearchCounters, setGlobalSearchCounters] = useState({
    apiSearchCount: 0,
    localSearchCount: 0,
    totalSearchCount: 0,
    loading: true
  });

  // Initial load to populate filter options
  useEffect(() => {
    fetchUserStats();
    fetchPatentStats();
    fetchSearchCounters();
    fetchGlobalSearchCounters();
  }, []);

  // Real-time listener for online users
  useEffect(() => {
    console.log('Setting up real-time listener for online users...');
    
    // Set up real-time listener for users collection
    const usersCollection = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      let onlineCount = 0;
      
      snapshot.forEach((doc) => {
        const userData = doc.data();
        
        // Count currently logged in users (check if user has a recent lastLogin within last 5 minutes for real-time accuracy)
        const lastLogin = userData.lastLogin?.toDate?.() || (userData.lastLogin ? new Date(userData.lastLogin) : null);
        const isCurrentlyLoggedIn = userData.isOnline || (lastLogin && (new Date() - lastLogin) < 5 * 60 * 1000);
        
        if (isCurrentlyLoggedIn) {
          onlineCount++;
        }
      });
      
      console.log('Real-time online users update:', onlineCount);
      
      // Update only the onlineUsers count without affecting loading state
      setUserStats(prev => ({
        ...prev,
        onlineUsers: onlineCount
      }));
    }, (error) => {
      console.error('Error in real-time listener:', error);
    });

    // Cleanup listener on unmount
    return () => {
      console.log('Cleaning up real-time listener for online users');
      unsubscribe();
    };
  }, []);

  // Reload data when filters change (but not on initial mount)
  useEffect(() => {
    const hasFilters = Object.values(filters).some(value => value !== '');
    if (hasFilters) {
      fetchUserStats();
      fetchPatentStats();
    }
  }, [filters]);

  const fetchSearchCounters = async () => {
    try {
      setSearchCounters(prev => ({ ...prev, loading: true }));
      
      if (userProfile?.uid) {
        console.log('Fetching search counters from Firestore for user:', userProfile.uid);
        const counters = await getSearchCounters(userProfile.uid);
        setSearchCounters({
          apiSearchCount: counters.apiSearchCount || 0,
          localSearchCount: counters.localSearchCount || 0,
          totalSearchCount: counters.totalSearchCount || 0,
          loading: false
        });
        console.log('✅ Search counters loaded:', counters);
      } else {
        console.warn('⚠️ No user profile available for search counters');
        setSearchCounters({
          apiSearchCount: 0,
          localSearchCount: 0,
          totalSearchCount: 0,
          loading: false
        });
      }
    } catch (error) {
      console.error('❌ Error fetching search counters:', error);
      setSearchCounters({
        apiSearchCount: 0,
        localSearchCount: 0,
        totalSearchCount: 0,
        loading: false
      });
    }
  };

  const fetchGlobalSearchCounters = async () => {
    try {
      setGlobalSearchCounters(prev => ({ ...prev, loading: true }));
      console.log('Fetching global search statistics from Firestore...');
      const globalStats = await getGlobalSearchStats();
      setGlobalSearchCounters({
        apiSearchCount: globalStats.apiSearchCount || 0,
        localSearchCount: globalStats.localSearchCount || 0,
        totalSearchCount: globalStats.totalSearchCount || 0,
        loading: false
      });
      console.log('✅ Global search counters loaded:', globalStats);
    } catch (error) {
      console.error('❌ Error fetching global search counters:', error);
      setGlobalSearchCounters({
        apiSearchCount: 0,
        localSearchCount: 0,
        totalSearchCount: 0,
        loading: false
      });
    }
  };

  const fetchUserStats = async () => {
    try {
      setUserStats(prev => ({ ...prev, loading: true }));
      
      console.log('Fetching user statistics from Firestore...');
      
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      
      let totalUsers = 0;
      let basicUsers = 0;
      let proUsers = 0;
      let enterpriseUsers = 0;
      let activeUsers = 0;
      let deactivatedUsers = 0;
      let onlineUsers = 0;
      
      const yearsSet = new Set();
      
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        
        // Apply filters
        let matchesFilter = true;
        
        // Date filter (check createdAt or registrationDate)
        const userDate = userData.createdAt?.toDate?.() || userData.registrationDate?.toDate?.() || new Date(userData.createdAt || userData.registrationDate);
        const userYear = userDate.getFullYear();
        
        if (filters.startDate && userDate < new Date(filters.startDate)) {
          matchesFilter = false;
        }
        if (filters.endDate && userDate > new Date(filters.endDate)) {
          matchesFilter = false;
        }
        
        // Year filter
        if (filters.year && userYear !== parseInt(filters.year)) {
          matchesFilter = false;
        }
        
        // Collect available years
        yearsSet.add(userYear);
        
        // Debug: Log first user to see structure
        if (totalUsers === 0) {
          console.log('Sample user data structure:', userData);
          console.log('User year:', userYear);
        }
        
        if (!matchesFilter) return;
        
        totalUsers++;
        
        // Count by subscription type
        const subscription = (userData.subscriptionType || 'basic').toLowerCase();
        if (subscription === 'basic') {
          basicUsers++;
        } else if (subscription === 'pro') {
          proUsers++;
        } else if (subscription === 'enterprise') {
          enterpriseUsers++;
        } else {
          // Default to basic if unknown
          basicUsers++;
        }
        
        // Count by account status
        const accountStatus = (userData.accountStatus || 'active').toLowerCase();
        
        if (accountStatus === 'active') {
          activeUsers++;
        } else if (accountStatus === 'deactivated') {
          deactivatedUsers++;
        } else {
          // Default to active if unknown
          activeUsers++;
        }
        
        // Count currently logged in users (check if user has a recent lastLogin within last 5 minutes for real-time accuracy)
        const lastLogin = userData.lastLogin?.toDate?.() || (userData.lastLogin ? new Date(userData.lastLogin) : null);
        const isCurrentlyLoggedIn = userData.isOnline || (lastLogin && (new Date() - lastLogin) < 5 * 60 * 1000);
        
        if (isCurrentlyLoggedIn) {
          onlineUsers++;
        }
      });
      
      // Update available filter options
      setAvailableFilters({
        years: Array.from(yearsSet).sort((a, b) => b - a)
      });
      
      console.log('User filter options:', {
        years: Array.from(yearsSet)
      });
      console.log('User filter counts:', {
        yearsCount: yearsSet.size
      });
      console.log('Final availableFilters state will be:', {
        years: Array.from(yearsSet).sort((a, b) => b - a)
      });
      
      console.log('User Stats:', {
        totalUsers,
        basicUsers,
        proUsers,
        enterpriseUsers,
        activeUsers,
        deactivatedUsers
      });
      
      setUserStats({
        totalUsers,
        basicUsers,
        proUsers,
        enterpriseUsers,
        activeUsers,
        deactivatedUsers,
        onlineUsers,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      setUserStats({
        totalUsers: 0,
        basicUsers: 0,
        proUsers: 0,
        enterpriseUsers: 0,
        activeUsers: 0,
        deactivatedUsers: 0,
        onlineUsers: 0,
        loading: false
      });
    }
  };

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
        let allPatents = await response.json();
        
        console.log('Legal Status - Fetched patents:', allPatents);
        console.log('Legal Status - Total patents:', allPatents.length);
        
        // Extract available filter options from patent data
        const patentYears = new Set();
        
        allPatents.forEach(patent => {
          // Extract year from filing date
          const patentDate = new Date(patent.filingDate || patent.createdAt || patent.timestamp);
          const patentYear = patentDate.getFullYear();
          patentYears.add(patentYear);
          
          // Debug: Log first patent to see structure
          if (allPatents.indexOf(patent) === 0) {
            console.log('Sample patent data structure:', patent);
            console.log('Patent year:', patentYear);
          }
        });
        
        console.log('Patent year data extracted:', {
          years: Array.from(patentYears)
        });
        console.log('Patent filter counts:', {
          yearsCount: patentYears.size
        });
        
        // Merge with existing filter options from user data
        setAvailableFilters(prev => {
          const merged = {
            years: Array.from(new Set([...prev.years, ...patentYears])).sort((a, b) => b - a)
          };
          console.log('Merging filters - Previous:', prev);
          console.log('Merging filters - Patent data:', {
            years: Array.from(patentYears)
          });
          console.log('Merging filters - Final merged:', merged);
          return merged;
        });
        
        // Apply filters
        let filteredPatents = allPatents.filter(patent => {
          // Date filter (check filing date or createdAt)
          const patentDate = new Date(patent.filingDate || patent.createdAt || patent.timestamp);
          const patentYear = patentDate.getFullYear();
          
          if (filters.startDate && patentDate < new Date(filters.startDate)) {
            return false;
          }
          if (filters.endDate && patentDate > new Date(filters.endDate)) {
            return false;
          }
          
          // Year filter
          if (filters.year && patentYear !== parseInt(filters.year)) {
            return false;
          }
          
          return true;
        });
        
        console.log('Filtered patents:', filteredPatents.length);
        
        // Calculate statistics (same logic as Admin Panel)
        const total = filteredPatents.length;
        const granted = filteredPatents.filter(p => p.stage5Granted === true).length;
        const rejected = filteredPatents.filter(p => {
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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    // Reset filters
    setFilters({
      startDate: '',
      endDate: '',
      year: ''
    });
    setShowFilters(false);
    
    // Reset stats to loading state
    setStats(prev => ({ ...prev, loading: true }));
    setUserStats(prev => ({ ...prev, loading: true }));
    
    // Immediately fetch fresh data
    fetchUserStats();
    fetchPatentStats();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div key={refreshKey} className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-md border-2 transition-all duration-300 ${
                hasActiveFilters 
                  ? 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-semibold">
                Filters {hasActiveFilters && `(${Object.values(filters).filter(v => v !== '').length})`}
              </span>
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Immediately close filters and reset them
                setShowFilters(false);
                setFilters({
                  startDate: '',
                  endDate: '',
                  year: ''
                });
                
                // Set all data to loading state immediately
                setStats(prev => ({ ...prev, loading: true }));
                setUserStats(prev => ({ ...prev, loading: true }));
                setSearchCounters(prev => ({ ...prev, loading: true }));
                setGlobalSearchCounters(prev => ({ ...prev, loading: true }));
                
                // Use setTimeout to ensure state updates process, then fetch fresh data
                setTimeout(async () => {
                  try {
                    await Promise.all([
                      fetchUserStats(),
                      fetchPatentStats(),
                      fetchSearchCounters(),
                      fetchGlobalSearchCounters()
                    ]);
                  } catch (error) {
                    console.error('Error refreshing data:', error);
                  }
                }, 0);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-md border-2 bg-red-500 border-red-500 text-white hover:bg-red-600 transition-all duration-300"
            >
              <span className="text-sm font-semibold">
                don't click here
              </span>
            </button>
            
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">
                System-wide Patent Statistics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100 animate-fadeIn relative z-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">Filter Statistics</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 font-semibold text-sm"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {/* Date Range Filters */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-all duration-200"
              />
            </div>
            
            {/* Year Filter */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-all duration-200 bg-white relative z-10 appearance-auto"
              >
                <option value="">All Years</option>
                {availableFilters.years.length === 0 && (
                  <option disabled>No years available</option>
                )}
                {availableFilters.years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {availableFilters.years.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">No year data found in database</p>
              )}
            </div>
            
            {/* Reset Filter Button */}
            <div className="relative flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-semibold"
              >
                Reset and Close Filter
              </button>
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
              {filters.startDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  From: {new Date(filters.startDate).toLocaleDateString()}
                  <button onClick={() => handleFilterChange('startDate', '')} className="hover:text-indigo-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.endDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  To: {new Date(filters.endDate).toLocaleDateString()}
                  <button onClick={() => handleFilterChange('endDate', '')} className="hover:text-indigo-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.year && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Year: {filters.year}
                  <button onClick={() => handleFilterChange('year', '')} className="hover:text-purple-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search Statistics Card with Two Circles */}
      <div className="mb-8 w-full">
        <div className="relative group bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-100/50 hover:border-purple-200 overflow-hidden">
          {/* Background Gradient Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-purple-100/20 to-pink-100/30 opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/10 via-purple-200/10 to-pink-200/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/20 rounded-full blur-3xl opacity-40 -translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-200/30 to-purple-200/20 rounded-full blur-3xl opacity-40 translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative p-10">
            {/* Flex Container - Text Left, Circles Right */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Left Side - Text Content */}
              <div className="flex-1 lg:max-w-md space-y-6">
                {/* Header */}
                <div className="text-left">
                  <h2 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-3 leading-tight">
                    Search Analytics Dashboard
                  </h2>
                  <p className="text-gray-600 text-lg font-medium leading-relaxed">Track your search activity and global platform usage</p>
                </div>
                
                {/* Stats Summary */}
                <div className="space-y-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-purple-100/50 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold">Your Contribution</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      {globalSearchCounters.totalSearchCount > 0 
                        ? ((searchCounters.totalSearchCount / globalSearchCounters.totalSearchCount) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                      <span className="text-gray-600 font-semibold">Online Users</span>
                    </div>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                      {userStats.onlineUsers}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Two Circles */}
              <div className="flex flex-row lg:flex-row gap-8 lg:gap-12 items-center justify-end flex-1 lg:ml-8">
              
              {/* Personal Search Counter Circle */}
              <div className="flex flex-col items-center">
                <div className="relative group/circle">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover/circle:opacity-40 blur-xl transition-all duration-500"></div>
                  
                  {/* Circle */}
                  <div className="relative bg-white/90 backdrop-blur-md rounded-full p-8 w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200/50">
                    {/* Icon */}
                    <div className="mb-3 bg-gradient-to-br from-blue-500 to-purple-600 p-3 lg:p-4 rounded-full shadow-lg">
                      <Search className="w-6 h-6 lg:w-8 lg:h-8 text-white" strokeWidth={2.5} />
                    </div>
                    
                    {/* Counter */}
                    {searchCounters.loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500"></div>
                        <span className="text-sm text-gray-500 font-medium">Loading...</span>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                          {searchCounters.totalSearchCount}
                        </h3>
                        <p className="text-xs lg:text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Your Searches</p>
                        
                        {/* Breakdown */}
                        <div className="space-y-1.5 w-full px-4 lg:px-6">
                          <div className="flex items-center justify-between text-sm lg:text-base">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="font-semibold text-blue-600">API</span>
                            </div>
                            <span className="font-bold text-blue-700">{searchCounters.apiSearchCount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm lg:text-base">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="font-semibold text-purple-600">Local</span>
                            </div>
                            <span className="font-bold text-purple-700">{searchCounters.localSearchCount}</span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Decorative Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="48%"
                        fill="none"
                        stroke="url(#personalGradient)"
                        strokeWidth="3"
                        strokeDasharray={`${searchCounters.totalSearchCount > 0 ? 100 * 3.14 : 0} 314`}
                        className="transition-all duration-1000"
                        opacity="0.3"
                      />
                      <defs>
                        <linearGradient id="personalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                
                {/* Label */}
                <div className="mt-4 bg-gradient-to-r from-blue-100/80 to-purple-100/80 px-4 py-2 rounded-full border border-blue-200/50">
                  <p className="text-sm font-bold text-blue-700">Personal Activity</p>
                </div>
              </div>

              {/* Global Search Counter Circle */}
              <div className="flex flex-col items-center">
                <div className="relative group/circle">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-0 group-hover/circle:opacity-40 blur-xl transition-all duration-500"></div>
                  
                  {/* Circle */}
                  <div className="relative bg-white/90 backdrop-blur-md rounded-full p-8 w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200/50">
                    {/* Icon */}
                    <div className="mb-3 bg-gradient-to-br from-purple-500 to-pink-600 p-3 lg:p-4 rounded-full shadow-lg">
                      <Globe className="w-6 h-6 lg:w-8 lg:h-8 text-white" strokeWidth={2.5} />
                    </div>
                    
                    {/* Counter */}
                    {globalSearchCounters.loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-500"></div>
                        <span className="text-sm text-gray-500 font-medium">Loading...</span>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                          {globalSearchCounters.totalSearchCount}
                        </h3>
                        <p className="text-xs lg:text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Global Searches</p>
                        
                        {/* Breakdown */}
                        <div className="space-y-1.5 w-full px-4 lg:px-6">
                          <div className="flex items-center justify-between text-sm lg:text-base">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="font-semibold text-purple-600">API</span>
                            </div>
                            <span className="font-bold text-purple-700">{globalSearchCounters.apiSearchCount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm lg:text-base">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                              <span className="font-semibold text-pink-600">Local</span>
                            </div>
                            <span className="font-bold text-pink-700">{globalSearchCounters.localSearchCount}</span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Decorative Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="48%"
                        fill="none"
                        stroke="url(#globalGradient)"
                        strokeWidth="3"
                        strokeDasharray={`${globalSearchCounters.totalSearchCount > 0 ? 100 * 3.14 : 0} 314`}
                        className="transition-all duration-1000"
                        opacity="0.3"
                      />
                      <defs>
                        <linearGradient id="globalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                
                {/* Label */}
                <div className="mt-4 bg-gradient-to-r from-purple-100/80 to-pink-100/80 px-4 py-2 rounded-full border border-purple-200/50">
                  <p className="text-sm font-bold text-purple-700">Platform Wide</p>
                </div>
              </div>
            </div>
            
            </div>
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

      {/* Subscription Details Card */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Subscription Details</h3>
          </div>

          {userStats.loading ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-24 bg-gray-200 rounded-xl"></div>
                <div className="h-24 bg-gray-200 rounded-xl"></div>
                <div className="h-24 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-24 bg-gray-200 rounded-xl"></div>
                <div className="h-24 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Total Registered Users and Subscription Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Registered Users */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-blue-600 uppercase">Total Registered Users</p>
                      <h4 className="text-3xl font-black text-blue-900">{userStats.totalUsers}</h4>
                    </div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                {/* Basic Users */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-600 uppercase">Basic</p>
                      <h4 className="text-3xl font-black text-gray-900">{userStats.basicUsers}</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">
                      {userStats.totalUsers > 0 ? Math.round((userStats.basicUsers / userStats.totalUsers) * 100) : 0}%
                    </span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${userStats.totalUsers > 0 ? (userStats.basicUsers / userStats.totalUsers) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Pro Users */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-purple-600 uppercase">Pro</p>
                      <h4 className="text-3xl font-black text-purple-900">{userStats.proUsers}</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-500 font-medium">
                      {userStats.totalUsers > 0 ? Math.round((userStats.proUsers / userStats.totalUsers) * 100) : 0}%
                    </span>
                    <div className="w-2/3 bg-purple-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${userStats.totalUsers > 0 ? (userStats.proUsers / userStats.totalUsers) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Enterprise Users */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-amber-600 uppercase">Enterprise</p>
                      <h4 className="text-3xl font-black text-amber-900">{userStats.enterpriseUsers}</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-600 font-medium">
                      {userStats.totalUsers > 0 ? Math.round((userStats.enterpriseUsers / userStats.totalUsers) * 100) : 0}%
                    </span>
                    <div className="w-2/3 bg-amber-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${userStats.totalUsers > 0 ? (userStats.enterpriseUsers / userStats.totalUsers) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status Section */}
              <div className="border-t-2 border-gray-100 pt-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  Account Status Overview
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Active Users */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-xl">
                        <UserCheck className="w-7 h-7 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-600 uppercase mb-1">Active Users</p>
                        <div className="flex items-baseline gap-2">
                          <h4 className="text-4xl font-black text-green-900">{userStats.activeUsers}</h4>
                          <span className="text-lg font-bold text-green-600">
                            ({userStats.totalUsers > 0 ? Math.round((userStats.activeUsers / userStats.totalUsers) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 w-full bg-green-200 rounded-full h-3">
                      <div 
                        className="h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 shadow-sm" 
                        style={{ width: `${userStats.totalUsers > 0 ? (userStats.activeUsers / userStats.totalUsers) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Deactivated Users */}
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-200 hover:border-red-400 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-100 p-3 rounded-xl">
                        <UserX className="w-7 h-7 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-600 uppercase mb-1">Deactivated Users</p>
                        <div className="flex items-baseline gap-2">
                          <h4 className="text-4xl font-black text-red-900">{userStats.deactivatedUsers}</h4>
                          <span className="text-lg font-bold text-red-600">
                            ({userStats.totalUsers > 0 ? Math.round((userStats.deactivatedUsers / userStats.totalUsers) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 w-full bg-red-200 rounded-full h-3">
                      <div 
                        className="h-3 bg-gradient-to-r from-red-500 to-rose-600 rounded-full transition-all duration-1000 shadow-sm" 
                        style={{ width: `${userStats.totalUsers > 0 ? (userStats.deactivatedUsers / userStats.totalUsers) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* India Patent Distribution Map */}
      <div className="mb-8">
        <IndiaPatentPanel showHeatMap={true} />
      </div>

      {/* Additional Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Success Rate Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Success Rate</h3>
          </div>
          
          {!stats.loading && stats.total > 0 ? (
            <div className="space-y-6">
              {/* Main Success Rate Display */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                    {Math.round(((stats.total - stats.rejected) / stats.total) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Overall Success Rate</div>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { 
                          name: 'Successful Applications', 
                          value: stats.total - stats.rejected,
                          percentage: ((stats.total - stats.rejected) / stats.total * 100).toFixed(1)
                        },
                        { 
                          name: 'Rejected Applications', 
                          value: stats.rejected,
                          percentage: (stats.rejected / stats.total * 100).toFixed(1)
                        }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1000}
                      label={({percentage}) => `${percentage}%`}
                      labelLine={true}
                    >
                      <Cell fill="url(#successGradient)" />
                      <Cell fill="url(#failureGradient)" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                      formatter={(value, name, props) => [
                        <span className="font-semibold">{value} applications ({props.payload.percentage}%)</span>,
                        <span className="font-bold">{props.payload.name}</span>
                      ]}
                    />
                    <defs>
                      <linearGradient id="successGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#ec4899" stopOpacity={0.9}/>
                      </linearGradient>
                      <linearGradient id="failureGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.7}/>
                        <stop offset="100%" stopColor="#6b7280" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{stats.total - stats.rejected}</div>
                  <div className="text-xs text-gray-600 mt-1 font-medium">Successful</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-600">{stats.rejected}</div>
                  <div className="text-xs text-gray-600 mt-1 font-medium">Rejected</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed text-center bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                <span className="font-semibold text-purple-700">{stats.total - stats.rejected}</span> out of{' '}
                <span className="font-semibold text-gray-700">{stats.total}</span> patent applications have not been rejected, 
                demonstrating strong application quality and review success.
              </p>
            </div>
          ) : stats.loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No data available yet. File your first patent to see statistics.</p>
          )}
        </div>

        {/* Portfolio Health Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Portfolio Health</h3>
          </div>
          
          {!stats.loading && stats.total > 0 ? (
            <div className="space-y-6">
              {/* Bar Chart */}
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { 
                        name: 'Active Patents', 
                        count: stats.granted, 
                        percentage: ((stats.granted / stats.total) * 100).toFixed(1)
                      },
                      { 
                        name: 'Rejected', 
                        count: stats.rejected, 
                        percentage: ((stats.rejected / stats.total) * 100).toFixed(1)
                      },
                      { 
                        name: 'Under Review', 
                        count: stats.total - stats.granted - stats.rejected, 
                        percentage: (((stats.total - stats.granted - stats.rejected) / stats.total) * 100).toFixed(1)
                      }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-15}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      label={{ value: 'Number of Patents', angle: -90, position: 'insideLeft', style: { fill: '#374151', fontWeight: 600 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                      formatter={(value, name, props) => {
                        return [
                          <span className="font-semibold">{value} patents ({props.payload.percentage}%)</span>,
                          ''
                        ];
                      }}
                      labelFormatter={(label) => <span className="font-bold text-gray-900">{label}</span>}
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[8, 8, 0, 0]}
                      animationDuration={1000}
                    >
                      <Cell fill="url(#activeGradient)" />
                      <Cell fill="url(#rejectedGradient)" />
                      <Cell fill="url(#reviewGradient)" />
                    </Bar>
                    <defs>
                      <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                      </linearGradient>
                      <linearGradient id="rejectedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8}/>
                      </linearGradient>
                      <linearGradient id="reviewGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#d97706" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.granted}</div>
                  <div className="text-xs text-gray-600 mt-1">Active</div>
                  <div className="text-xs text-gray-500">{((stats.granted / stats.total) * 100).toFixed(1)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-xs text-gray-600 mt-1">Rejected</div>
                  <div className="text-xs text-gray-500">{((stats.rejected / stats.total) * 100).toFixed(1)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.total - stats.granted - stats.rejected}</div>
                  <div className="text-xs text-gray-600 mt-1">Under Review</div>
                  <div className="text-xs text-gray-500">{(((stats.total - stats.granted - stats.rejected) / stats.total) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ) : stats.loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
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
