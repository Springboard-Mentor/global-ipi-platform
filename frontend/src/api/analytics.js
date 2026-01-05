// FILE LOCATION: frontend/src/api/analytics.js
// Production-ready Analytics API Client for Legal Dashboard & Landscape Visualization

import apiClient from './client';

/**
 * ========================================
 * LEGAL STATUS DASHBOARD APIs
 * ========================================
 */

export const analyticsAPI = {
  
  // ============ DASHBOARD SUMMARY ============
  /**
   * Get overall dashboard statistics
   * Endpoint: GET /api/analytics/summary
   * @param {Object} params - { dateRange, type, jurisdiction }
   * @returns {Object} { totalFilings, activePatents, pendingApplications, expiringSoon }
   */
  getDashboardSummary: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/summary', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  // ============ FILINGS TREND ============
  /**
   * Get filing trends over time (monthly/quarterly)
   * Endpoint: GET /api/analytics/filings-trend
   * @param {Object} params - { dateRange, type, jurisdiction }
   * @returns {Array} [{ month, patents, trademarks }]
   */
  getFilingsTrend: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/filings-trend', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching filings trend:', error);
      throw error;
    }
  },

  // ============ STATUS DISTRIBUTION ============
  /**
   * Get status distribution for pie chart
   * Endpoint: GET /api/analytics/status-distribution
   * @param {Object} params - { dateRange, type, jurisdiction }
   * @returns {Array} [{ name, value, color }]
   */
  getStatusDistribution: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/status-distribution', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching status distribution:', error);
      throw error;
    }
  },

  // ============ FIELD-WISE TRENDS ============
  /**
   * Get field-wise statistics and growth
   * Endpoint: GET /api/analytics/field-wise-trends
   * @param {Object} params - { dateRange, type, jurisdiction }
   * @returns {Array} [{ field, count, growth, percentage }]
   */
  getFieldWiseTrends: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/field-wise-trends', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching field-wise trends:', error);
      throw error;
    }
  },

  // ============ JURISDICTION BREAKDOWN ============
  /**
   * Get jurisdiction-wise breakdown
   * Endpoint: GET /api/analytics/jurisdiction-breakdown
   * @param {Object} params - { dateRange, type }
   * @returns {Array} [{ jurisdiction, patents, trademarks }]
   */
  getJurisdictionBreakdown: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/jurisdiction-breakdown', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching jurisdiction breakdown:', error);
      throw error;
    }
  },

  // ============ STATUS TIMELINE ============
  /**
   * Get status changes over time (quarterly view)
   * Endpoint: GET /api/analytics/status-timeline
   * @param {Object} params - { dateRange, type, jurisdiction }
   * @returns {Array} [{ quarter, filed, granted, rejected, abandoned }]
   */
  getStatusTimeline: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/status-timeline', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching status timeline:', error);
      throw error;
    }
  },

  // ============ EXPIRING PATENTS ============
  /**
   * Get patents expiring soon
   * Endpoint: GET /api/analytics/expiring-soon
   * @param {Number} days - Number of days threshold (default: 90)
   * @returns {Array} [{ id, title, expiryDate, daysRemaining }]
   */
  getExpiringPatents: async (days = 90) => {
    try {
      const response = await apiClient.get('/api/analytics/expiring-soon', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching expiring patents:', error);
      throw error;
    }
  },

  /**
   * ========================================
   * LANDSCAPE VISUALIZATION APIs
   * ========================================
   */

  // ============ TECHNOLOGY LANDSCAPE ============
  /**
   * Get technology landscape matrix
   * Endpoint: GET /api/analytics/landscape/technology
   * @param {Object} params - { field, dateRange, jurisdiction }
   * @returns {Object} { technologies: [], matrix: [] }
   */
  getTechnologyLandscape: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/landscape/technology', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching technology landscape:', error);
      throw error;
    }
  },

  // ============ COMPETITOR ANALYSIS ============
  /**
   * Get competitor portfolio comparison
   * Endpoint: GET /api/analytics/landscape/competitors
   * @param {Object} params - { field, topN }
   * @returns {Array} [{ assignee, patentCount, activeCount, growth }]
   */
  getCompetitorAnalysis: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/landscape/competitors', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching competitor analysis:', error);
      throw error;
    }
  },

  // ============ INNOVATION TRENDS ============
  /**
   * Get innovation trends over time
   * Endpoint: GET /api/analytics/landscape/innovation-trends
   * @param {Object} params - { field, years }
   * @returns {Array} [{ year, innovations, growthRate }]
   */
  getInnovationTrends: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/landscape/innovation-trends', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching innovation trends:', error);
      throw error;
    }
  },

  // ============ TECHNOLOGY CONVERGENCE ============
  /**
   * Get technology convergence map
   * Endpoint: GET /api/analytics/landscape/convergence
   * @param {Object} params - { fields, minOverlap }
   * @returns {Array} [{ field1, field2, overlapCount, strength }]
   */
  getTechnologyConvergence: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/landscape/convergence', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching technology convergence:', error);
      throw error;
    }
  },

  // ============ PATENT LIFECYCLE ============
  /**
   * Get patent lifecycle analysis
   * Endpoint: GET /api/analytics/landscape/lifecycle
   * @param {Object} params - { field, jurisdiction }
   * @returns {Object} { avgLifespan, stages: [] }
   */
  getLifecycleAnalysis: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/landscape/lifecycle', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching lifecycle analysis:', error);
      throw error;
    }
  },

  // ============ IPC/CPC CLASSIFICATION TRENDS ============
  /**
   * Get IPC/CPC classification distribution
   * Endpoint: GET /api/analytics/landscape/classifications
   * @param {Object} params - { topN, dateRange }
   * @returns {Array} [{ code, description, count, trend }]
   */
  getClassificationTrends: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/landscape/classifications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching classification trends:', error);
      throw error;
    }
  },

  // ============ TOP INVENTORS ============
  /**
   * Get top inventors analysis
   * Endpoint: GET /api/analytics/landscape/top-inventors
   * @param {Object} params - { field, topN }
   * @returns {Array} [{ name, patentCount, fields, impact }]
   */
  getTopInventors: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/landscape/top-inventors', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching top inventors:', error);
      throw error;
    }
  },

  // ============ CITATION ANALYSIS ============
  /**
   * Get patent citation network
   * Endpoint: GET /api/analytics/landscape/citations
   * @param {Object} params - { patentId, depth }
   * @returns {Object} { nodes: [], edges: [] }
   */
  getCitationNetwork: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/analytics/landscape/citations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching citation network:', error);
      throw error;
    }
  },

  // ============ EXPORT ANALYTICS DATA ============
  /**
   * Export analytics data in various formats
   * Endpoint: GET /api/analytics/export/{type}
   * @param {String} type - 'summary', 'trends', 'landscape', etc.
   * @param {String} format - 'csv', 'json', 'pdf'
   * @param {Object} params - Additional filters
   * @returns {Blob} File download
   */
  exportAnalytics: async (type, format = 'csv', params = {}) => {
    try {
      const response = await apiClient.get(`/api/analytics/export/${type}`, {
        params: { format, ...params },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting analytics:', error);
      throw error;
    }
  }
};

export default analyticsAPI;