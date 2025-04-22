const apiUrl = import.meta.env.VITE_API_URL;
export const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`, options);
    
    // Handle cases where response might be empty
    if (response.status === 204) { // No Content
      return null;
    }

    // Check if response has content before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (response.ok) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error: ${response.status}`, data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Fetch Error:', error.message);
    throw error;
  }
};
