const apiUrl = import.meta.env.VITE_API_URL;


export const fetchData = async (endpoint, options = {}) => {
    try {
        console.log('API Base URL:', apiUrl);
      const response = await fetch(`${apiUrl}${endpoint}`, options);
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
  