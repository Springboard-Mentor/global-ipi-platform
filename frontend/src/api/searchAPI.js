import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api/search';

export const searchAPI = {
  searchAll: async (params) => {
    try {
      const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      };

      const processFilter = (input) => {
        if (!input) return null;
        if (Array.isArray(input)) {
          return input.length > 0 ? input.join(',') : null;
        }
        return input;
      };

      const queryParams = {
        q: params.keyword || '',
        source: params.source || 'local',
        type: params.ipType === 'both' ? 'ALL' : (params.ipType || 'ALL').toUpperCase(),
        jurisdictions: processFilter(params.jurisdictions),
        statuses: processFilter(params.statuses),
        dateFrom: formatDate(params.dateFrom),
        dateTo: formatDate(params.dateTo),
        page: params.page || 0,
        size: params.size || 10,
        sortBy: params.sortBy || 'filingDate',
        sortDirection: params.sortDirection || 'desc'
      };

      const response = await axios.get(BASE_URL, { params: queryParams });
      const data = response.data;

      if (Array.isArray(data)) {
        return { content: data, totalElements: data.length, totalPages: 1 };
      } else {
        return {
          content: data.content || [],
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 0
        };
      }
    } catch (error) {
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  }
};