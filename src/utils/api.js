const apiUrl = import.meta.env.VITE_API_URL;
export const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`, options);

    if (response.status === 204) { // No Content
      return null;
    }

    const contentType = response.headers.get('content-type');

    // If response is not JSON and status is OK, return null (or text if you want)
    if (!contentType || !contentType.includes('application/json')) {
      if (response.ok) {
        return null;
      }
      // Non-OK and not JSON — get error text and throw
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Parse JSON only after checking OK
    if (!response.ok) {
      // For error responses with JSON body, parse error message
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Finally parse successful JSON response
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('API Fetch Error:', error.message);
    throw error;
  }
};

