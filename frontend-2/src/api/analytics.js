import apiClient from './client';

export const analyticsAPI = {
  getDashboardSummary: async (params) => {
    const response = await apiClient.get('/analytics/summary', { params });
    return response.data;
  },

  getStatusDistribution: async (params) => {
    const response = await apiClient.get('/analytics/status-distribution', { params });
    return response.data;
  },

  getFilingsTrend: async (params) => {
    const response = await apiClient.get('/analytics/filings-trend', { params });
    return response.data;
  },

  getFieldWiseTrends: async (params) => {
    const response = await apiClient.get('/analytics/field-wise-trends', { params });
    return response.data;
  },

  getJurisdictionBreakdown: async (params) => {
    const response = await apiClient.get('/analytics/jurisdiction-breakdown', { params });
    return response.data;
  },

  getStatusTimeline: async (params) => {
    const response = await apiClient.get('/analytics/status-timeline', { params });
    return response.data;
  },

  getExpiringPatents: async (params) => {
    try {
      const response = await apiClient.get('/dashboard/upcoming-deadlines', { params });
      return response.data;
    } catch (error) {
      return []; 
    }
  },

  getClassificationTrends: async (params) => {
    const response = await apiClient.get('/analytics/landscape/classifications', { params });
    return response.data;
  },

  getCompetitorAnalysis: async (params) => {
    const response = await apiClient.get('/analytics/landscape/competitors', { params });
    return response.data;
  },

  getInnovationTrends: async (params) => {
    const response = await apiClient.get('/analytics/landscape/innovation-trends', { params });
    return response.data;
  },

  getTopInventors: async (params) => {
    const response = await apiClient.get('/analytics/landscape/top-inventors', { params });
    return response.data;
  },

  getTechnologyLandscape: async (params) => {
    const response = await apiClient.get('/analytics/landscape/technology', { params });
    return response.data;
  },

  getTechnologyConvergence: async (params) => {
    const response = await apiClient.get('/analytics/landscape/convergence', { params });
    return response.data;
  },

  getLifecycleAnalysis: async (params) => {
    const response = await apiClient.get('/analytics/landscape/lifecycle', { params });
    return response.data;
  },

  getAssetsByCategory: async (category, dateRange, type, jurisdiction) => {
    const response = await apiClient.get('/analytics/assets/category', { 
      params: { 
        category,
        dateRange,
        type,
        jurisdiction 
      } 
    });
    return response.data;
  },

  exportAnalytics: async (type, format, params) => {
    const response = await apiClient.get(`/analytics/export/${type}`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  }
};

export default analyticsAPI;