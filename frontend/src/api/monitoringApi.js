import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

// Monitoring API base
const MONITORING_BASE = `${BASE_URL}/api/admin/monitoring`;

/**
 * INTEGRATED MONITORING DATA - Similar to IP Assets integration
 * Fetches all monitoring data in a single request for efficient loading
 */
export const fetchAllMonitoringData = (params = {}) => {
  const token = localStorage.getItem("adminToken");
  
  // Convert object { timeRange: '7d', category: 'ai' } to query string ?timeRange=7d&category=ai
  const queryString = new URLSearchParams(params).toString();
  const url = `${MONITORING_BASE}/all-data${queryString ? `?${queryString}` : ''}`;
  
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

/**
 * Individual monitoring endpoints (for specific use cases)
 */
export const fetchSystemHealth = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/health`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

export const fetchActivityStats = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/activity`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

export const fetchPatentTrends = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/trends`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

export const fetchTrafficData = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/traffic`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

/**
 * Chart data endpoints (for individual chart updates)
 */
export const fetchTrafficChartData = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/charts/traffic`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

export const fetchResponsePerformanceData = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/charts/response-performance`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

export const fetchUserActivityData = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/charts/user-activity`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

export const fetchFeatureUsageData = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/charts/feature-usage`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

export const fetchSessionDurationData = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/charts/session-duration`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

export const fetchFilingTrendsData = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/charts/filing-trends`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

export const fetchCategoryData = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/charts/categories`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};

export const fetchGrantRateData = () => {
  const token = localStorage.getItem("adminToken");
  return axios.get(`${MONITORING_BASE}/charts/grant-rates`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
};