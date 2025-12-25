// src/api/geoAPI.js

import client from './client';

export const geoAPI = {
  // Get geographic distribution of all IP assets
  getGeoDistribution: async (params = {}) => {
    // REMOVED '/api' from the start
    const { data } = await client.get('/geo/distribution', { params });
    return data;
  },

  // Search geo distribution with keyword filter
  searchGeoDistribution: async (keyword, ipType = null) => {
    const params = { keyword };
    if (ipType && ipType !== 'both') params.ipType = ipType;
    // REMOVED '/api' from the start
    const { data } = await client.get('/geo/distribution/search', { params });
    return data;
  },

  // Get global statistics
  getGlobalStats: async () => {
    // REMOVED '/api' from the start
    const { data } = await client.get('/geo/stats');
    return data;
  }
};