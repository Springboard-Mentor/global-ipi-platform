import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

// IP Assets API base
const API_BASE = `${BASE_URL}/api/ip-assets`;

//  STATUS NORMALIZATION (UNIT)
const normalizeStatus = (status) =>
  status ? status.toUpperCase() : status;

// legalstatus
export const fetchAllIPAssets = () =>
  axios.get(API_BASE).then((res) =>
    res.data.map((item) => ({
      ...item,
      legalStatus: normalizeStatus(item.legalStatus),
    }))
  );
  
export const fetchStatusSummary = () =>
  axios.get(`${API_BASE}/legal-status-summary`).then((res) => res.data);

/**
 * Search Intellectual Property (Patents, Trademarks, etc.)
 * Backend handles SerpAPI / external providers
 */
export async function searchIP({
  query,
  type = "PATENT",
  source = "EXTERNAL",
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(`${BASE_URL}/api/ip/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        type,
        source,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      let message = "Failed to fetch IP data";
      try {
        const errorBody = await response.json();
        message = errorBody?.message || message;
      } catch (_) {}
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  }
}

/**
 * Get IP details by ID
 * @param {string|number} id - The ID of the IP asset
 * @returns {Promise<Object>} - The IP asset details
 */
export async function getIPDetails(id) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    // Use /api/ip/{id} endpoint which returns IPSearchResultDTO with all fields including priorityDate, grantDate, updatedOn
    const response = await fetch(`${BASE_URL}/api/ip/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      let message = "Failed to fetch IP details";
      try {
        const errorBody = await response.json();
        message = errorBody?.message || message;
      } catch (_) {}
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  }
}

/**
 * Subscribe/Watch an IP asset
 */
export async function subscribeToIP(ipAssetId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ ipAssetId }),
  });

  if (!response.ok) {
    throw new Error("Failed to subscribe to IP asset");
  }
  return await response.json();
}

/**
 * List user's IP subscriptions
 */
export async function listSubscriptions() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/subscriptions`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions");
  }
  return await response.json();
}

/**
 * Check SerpAPI key status
 * @returns {Promise<{valid: boolean, message: string}>}
 */
export async function checkSerpAPIKey() {
  try {
    const response = await fetch(`${BASE_URL}/api/test/serpapi-status`);
    if (!response.ok) {
      throw new Error("Failed to check SerpAPI status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error checking SerpAPI status:", error);
    return {
      valid: false,
      message: error.message || "Failed to connect to SerpAPI service",
    };
  }
}
