import axios from 'axios';

const API_BASE = "http://192.168.43.45:5001/api/notifications";

export const notificationAPI = {
    // Fetches real-time alerts from NotificationService
    getLatest: async (userId) => {
        const response = await axios.get(`${API_BASE}/user/${userId}`);
        return response.data;
    }
};