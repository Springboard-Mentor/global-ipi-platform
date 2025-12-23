import client from './client';

export const searchAPI = {
  searchAll: async (searchParams) => {
    try {
      // ✅ FIX: Removed '/v1' because it is already in the Base URL
      const response = await client.post('/search/all', {
        keyword: searchParams.keyword || null,
        ipType: searchParams.ipType || 'both',
        page: searchParams.page || 0,
        size: searchParams.size || 25,
        sortBy: searchParams.sortBy || 'filingDate',
        sortDirection: searchParams.sortDirection || 'desc',
      });
      return response.data;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  },
};