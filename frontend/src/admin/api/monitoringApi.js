import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:8081/api/admin/monitoring';

// Get admin token from localStorage
const getAdminToken = () => localStorage.getItem('adminToken');

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTEGRATED MONITORING DATA - Single API call for all monitoring data
export const fetchAllMonitoringData = async () => {
  try {
    const response = await apiClient.get('/all-data');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all monitoring data:', error);
    // Return mock data as fallback
    return generateMockMonitoringData();
  }
};

// Individual endpoint functions for backward compatibility
export const fetchSystemHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch system health:', error);
    return generateMockSystemHealth();
  }
};

export const fetchActivityStats = async () => {
  try {
    const response = await apiClient.get('/activity');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch activity stats:', error);
    return generateMockActivityStats();
  }
};

export const fetchTrafficData = async () => {
  try {
    const response = await apiClient.get('/traffic');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch traffic data:', error);
    return generateMockTrafficData();
  }
};

export const fetchPatentTrends = async () => {
  try {
    const response = await apiClient.get('/trends');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patent trends:', error);
    return generateMockPatentTrends();
  }
};

export const fetchUserActivityChart = async () => {
  try {
    const response = await apiClient.get('/charts/user-activity');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user activity chart:', error);
    return generateMockUserActivityData();
  }
};

export const fetchFeatureUsageChart = async () => {
  try {
    const response = await apiClient.get('/charts/feature-usage');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch feature usage chart:', error);
    return generateMockFeatureUsageData();
  }
};

export const fetchSessionDurationChart = async () => {
  try {
    const response = await apiClient.get('/charts/session-duration');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch session duration chart:', error);
    return generateMockSessionData();
  }
};

export const fetchFilingTrendsChart = async () => {
  try {
    const response = await apiClient.get('/charts/filing-trends');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch filing trends chart:', error);
    return generateMockFilingTrends();
  }
};

export const fetchCategoriesChart = async () => {
  try {
    const response = await apiClient.get('/charts/categories');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories chart:', error);
    return generateMockCategoriesData();
  }
};

export const fetchGrantRatesChart = async () => {
  try {
    const response = await apiClient.get('/charts/grant-rates');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch grant rates chart:', error);
    return generateMockGrantRatesData();
  }
};

// Mock data generators for fallback
const generateMockMonitoringData = () => ({
  systemHealth: generateMockSystemHealth(),
  activityStats: generateMockActivityStats(),
  patentTrends: generateMockPatentTrends(),
  trafficData: generateMockTrafficData(),
  chartData: {
    userActivity: generateMockUserActivityData(),
    featureUsage: generateMockFeatureUsageData(),
    sessionDuration: generateMockSessionData(),
    filingTrends: generateMockFilingTrends(),
    categories: generateMockCategoriesData(),
    grantRates: generateMockGrantRatesData(),
  }
});

const generateMockSystemHealth = () => ({
  cpuUsage: Math.floor(Math.random() * 100),
  memoryUsage: Math.floor(Math.random() * 100),
  diskUsage: Math.floor(Math.random() * 100),
  uptime: '2 days, 14 hours',
  activeThreads: Math.floor(Math.random() * 50) + 20,
  responseTime: Math.floor(Math.random() * 200) + 50
});

const generateMockActivityStats = () => ({
  totalUsers: Math.floor(Math.random() * 10000) + 5000,
  activeUsers: Math.floor(Math.random() * 1000) + 500,
  totalSessions: Math.floor(Math.random() * 50000) + 25000,
  averageSessionDuration: Math.floor(Math.random() * 30) + 10,
  pageViews: Math.floor(Math.random() * 100000) + 50000,
  uniqueVisitors: Math.floor(Math.random() * 5000) + 2500
});

const generateMockTrafficData = () => {
  const now = new Date();
  const data = [];
  for (let i = 59; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { second: '2-digit' }),
      requests: Math.floor(Math.random() * 20) + 5,
      users: Math.floor(Math.random() * 50) + 20,
      errors: Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0
    });
  }
  return {
    trafficData: data,
    realtimeStats: {
      currentUsers: Math.floor(Math.random() * 100) + 50,
      requestsPerSecond: Math.floor(Math.random() * 15) + 5,
      activeConnections: Math.floor(Math.random() * 200) + 100,
      bandwidth: Math.floor(Math.random() * 50) + 20
    }
  };
};

const generateMockPatentTrends = () => ({
  totalPatents: Math.floor(Math.random() * 10000) + 5000,
  pendingApplications: Math.floor(Math.random() * 2000) + 1000,
  grantedPatents: Math.floor(Math.random() * 8000) + 4000,
  averageProcessingTime: Math.floor(Math.random() * 24) + 12,
  successRate: Math.floor(Math.random() * 30) + 70
});

const generateMockUserActivityData = () => {
  const data = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      activeUsers: Math.floor(Math.random() * 500) + 200,
      newUsers: Math.floor(Math.random() * 100) + 20,
      returningUsers: Math.floor(Math.random() * 400) + 150
    });
  }
  return data;
};

const generateMockFeatureUsageData = () => {
  return [
    { name: 'IP Search', usage: Math.floor(Math.random() * 1000) + 500, percentage: 35 },
    { name: 'Patent Tracking', usage: Math.floor(Math.random() * 800) + 400, percentage: 28 },
    { name: 'Analytics', usage: Math.floor(Math.random() * 600) + 300, percentage: 20 },
    { name: 'Reports', usage: Math.floor(Math.random() * 400) + 200, percentage: 12 },
    { name: 'Notifications', usage: Math.floor(Math.random() * 200) + 100, percentage: 5 }
  ];
};

const generateMockSessionData = () => {
  return [
    { duration: '0-5 min', count: Math.floor(Math.random() * 200) + 100 },
    { duration: '5-15 min', count: Math.floor(Math.random() * 300) + 150 },
    { duration: '15-30 min', count: Math.floor(Math.random() * 250) + 125 },
    { duration: '30-60 min', count: Math.floor(Math.random() * 150) + 75 },
    { duration: '60+ min', count: Math.floor(Math.random() * 100) + 50 }
  ];
};

const generateMockFilingTrends = () => {
  const data = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      filings: Math.floor(Math.random() * 200) + 100,
      grants: Math.floor(Math.random() * 150) + 50
    });
  }
  return data;
};

const generateMockCategoriesData = () => {
  return [
    { name: 'AI & ML', value: 25, color: '#3B82F6' },
    { name: 'Biotech', value: 20, color: '#10B981' },
    { name: 'Renewable Energy', value: 18, color: '#F59E0B' },
    { name: 'Software', value: 15, color: '#EF4444' },
    { name: 'Hardware', value: 12, color: '#8B5CF6' },
    { name: 'Other', value: 10, color: '#6B7280' }
  ];
};

const generateMockGrantRatesData = () => {
  const data = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      grantRate: Math.floor(Math.random() * 20) + 70,
      approvalRate: Math.floor(Math.random() * 15) + 75
    });
  }
  return data;
};