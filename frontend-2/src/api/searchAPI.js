import axios from 'axios';

// ✅ Ensure this matches your running Spring Boot Port (usually 8080)
const BASE_URL = 'http://localhost:5001/api/search'; 

export const searchAPI = {
  searchAll: async (params) => {
    try {
      console.log("👉 FRONTEND PARAMS:", params);

      // 1. Construct Query Parameters for Backend
      const queryParams = {
        q: params.keyword || '',
        source: params.source || 'local',
        type: params.ipType === 'both' ? 'ALL' : (params.ipType || 'ALL').toUpperCase(),
        
        // Handle Arrays (Spring Boot expects comma-separated strings for lists)
        jurisdictions: Array.isArray(params.jurisdictions) && params.jurisdictions.length > 0 
            ? params.jurisdictions.join(',') 
            : null,
        
        status: Array.isArray(params.statuses) && params.statuses.length > 0 
            ? params.statuses.join(',') 
            : null,
        
        dateFrom: params.dateFrom || null,
        dateTo: params.dateTo || null,
        
        // Pagination & Sorting
        page: params.page || 0,
        size: params.size || 10,
        sortBy: params.sortBy || 'filingDate',
        sortDirection: params.sortDirection || 'desc'
      };

      console.log("📡 SENDING TO BACKEND:", queryParams);

      // 2. Make API Call
      const response = await axios.get(BASE_URL, { params: queryParams });

      // 3. Normalize Response Data
      // The backend returns a Page object: { content: [...], totalElements: ... }
      // This logic ensures the frontend always gets the expected structure.
      const data = response.data;
      
      if (Array.isArray(data)) {
        // Fallback if backend returns a raw List instead of Page
        return {
          content: data,
          totalElements: data.length,
          totalPages: 1
        };
      } else {
        // Standard Page response
        return {
          content: data.content || [],
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 0
        };
      }

    } catch (error) {
      console.error("❌ API Call Failed:", error);
      // Return safe empty structure to prevent frontend crash
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  }
};