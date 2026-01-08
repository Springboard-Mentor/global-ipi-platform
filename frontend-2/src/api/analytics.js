import apiClient from './client';

export const analyticsAPI = {
  // --- A. OVERVIEW & SUMMARY STATS ---
  
  /**
   * Fetches dashboard summary statistics.
   * Total Patents (e.g., 653), Active Filings, etc.
   */
  getDashboardSummary: async (params) => {
    const response = await apiClient.get('/analytics/summary', { params });
    return response.data;
  },

  /**
   * Fetches distribution data (Status/Category).
   * Maps to the /analytics/status-distribution endpoint.
   */
  getStatusDistribution: async (params) => {
    const response = await apiClient.get('/analytics/status-distribution', { params });
    return response.data;
  },

  /**
   * Fetches upcoming deadlines or expiring patents.
   * Includes error handling to ensure UI doesn't break on fetch failure.
   */
  getExpiringPatents: async (params) => {
    try {
      const response = await apiClient.get('/dashboard/upcoming-deadlines', { params });
      return response.data;
    } catch (error) {
      console.warn("Deadlines fetch failed, returning empty list.");
      return []; 
    }
  },

  // --- B. TIME-BASED TRENDS ---

  /**
   * Fetches innovation timeline data (Innovation Curve).
   */
  getInnovationTrends: async (params) => {
    const response = await apiClient.get('/analytics/landscape/innovation-trends', { params });
    return response.data;
  },

  /**
   * Fetches specific filing trends over time.
   */
  getFilingsTrend: async (params) => {
    const response = await apiClient.get('/analytics/filings-trend', { params });
    return response.data;
  },

  /**
   * Fetches the general status timeline.
   */
  getStatusTimeline: async (params) => {
    const response = await apiClient.get('/analytics/status-timeline', { params });
    return response.data;
  },

  // --- C. JURISDICTION & GEOGRAPHIC LANDSCAPE ---

  /**
   * Fetches jurisdiction-wise breakdown (Global reach).
   */
  getJurisdictionBreakdown: async (params) => {
    const response = await apiClient.get('/analytics/jurisdiction-breakdown', { params });
    return response.data;
  },

  // --- D. ADVANCED LANDSCAPE ANALYSIS ---

  /**
   * Fetches top Technology classifications (CPC Density).
   */
  getClassificationTrends: async (params) => {
    const response = await apiClient.get('/analytics/landscape/classifications', { params });
    return response.data;
  },

  /**
   * Fetches Strategic Competitor data (Portfolio Density/Velocity).
   */
  getCompetitorAnalysis: async (params) => {
    const response = await apiClient.get('/analytics/landscape/competitors', { params });
    return response.data;
  },

  /**
   * Fetches key Research Contributors (Top Inventors).
   */
  getTopInventors: async (params) => {
    const response = await apiClient.get('/analytics/landscape/top-inventors', { params });
    return response.data;
  },

  /**
   * Fetches dynamic Technology sectors for dropdowns.
   */
  getTechnologyLandscape: async (params) => {
    const response = await apiClient.get('/analytics/landscape/technology', { params });
    return response.data;
  },

  /**
   * Fetches relational data for the Convergence topology map.
   */
  getTechnologyConvergence: async (params) => {
    const response = await apiClient.get('/analytics/landscape/convergence', { params });
    return response.data;
  },

  /**
   * Fetches Maturity Index and active lifespan data.
   */
  getLifecycleAnalysis: async (params) => {
    const response = await apiClient.get('/analytics/landscape/lifecycle', { params });
    return response.data;
  },

  // --- E. ASSET MANAGEMENT & DRILL-DOWN ---

  /**
   * Fetches specific assets (real patents) based on category filters.
   * This retrieves the detailed records for the 653 patent assets.
   */
  getAssetsByCategory: async (category, range, type, jurisdiction) => {
    const response = await apiClient.get('/analytics/assets-by-category', { 
      params: { 
        category,
        range, // Maps to 'last_year', 'all', etc.
        type,
        jurisdiction 
      } 
    });
    return response.data;
  },

  /**
   * Exports analytical data as a blob (CSV/JSON).
   */
  exportAnalytics: async (type, format, params) => {
    const response = await apiClient.get(`/analytics/export/${type}`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  }
};

export default analyticsAPI;