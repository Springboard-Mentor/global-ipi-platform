import apiClient from './client';

export const analyticsAPI = {
  // A. Overview Stats
  getDashboardSummary: async () => {
    const response = await apiClient.get('/api/analytics/summary');
    return response.data;
  },

  // C. Field/Category Distribution
  getStatusDistribution: async () => {
    const response = await apiClient.get('/api/analytics/distribution');
    return response.data;
  },

  // B. Time-based Trends
  getInnovationData: async () => {
    const response = await apiClient.get('/api/analytics/timeline');
    return response.data;
  },

  // D. Jurisdiction Landscape
  getJurisdictionBreakdown: async (keyword = '') => {
    const response = await apiClient.get('/api/analytics/jurisdiction-stats', { 
      params: { keyword } 
    });
    return response.data;
  }
};