import axios from 'axios';

const API_BASE = "http://192.168.43.45:5001/api"; 

export const ipAssetAPI = {
    // Standard search for the repository
    getAssets: async (params) => {
        const response = await axios.get(`${API_BASE}/assets/search`, { params });
        return response.data;
    },
    
    // Fetches specifically tracked assets for the tracker page
    getTrackedAssets: async (userId) => {
        const response = await axios.get(`${API_BASE}/tracker/my-tracked-assets`, {
            params: { userId }
        });
        return response.data;
    }
};