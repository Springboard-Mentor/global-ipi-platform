// src/api/ipAssets.js
import apiClient from './client';

export const ipAssetAPI = {
  // Fetches paginated/filtered list of assets for the Detailed Filing Table
  getAssets: async (params) => {
    const response = await apiClient.get('/api/assets', { params });
    return response.data;
  },
  
  // Fetches details for a single asset
  getAssetDetails: async (id) => {
    const response = await apiClient.get(`/api/assets/${id}`);
    return response.data;
  }
};