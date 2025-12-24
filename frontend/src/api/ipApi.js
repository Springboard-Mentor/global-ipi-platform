const BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

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
 * Get SerpAPI key status
 * @returns {Promise<{valid: boolean, message: string}>}
 */
export async function checkSerpAPIKey() {
  try {
    const response = await fetch(`${BASE_URL}/api/test/serpapi-status`);
    if (!response.ok) {
      throw new Error('Failed to check SerpAPI status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking SerpAPI status:', error);
    return {
      valid: false,
      message: error.message || 'Failed to connect to SerpAPI service'
    };
  }
}