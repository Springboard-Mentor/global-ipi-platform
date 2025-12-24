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

    // Handle HTTP errors
    if (!response.ok) {
      let message = "Failed to fetch IP data";

      try {
        const errorBody = await response.json();
        message = errorBody?.message || message;
      } catch (_) {}

      throw new Error(message);
    }

    // Parse JSON safely
    const data = await response.json();

    // Expecting SerpAPI-style response
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  }
}
