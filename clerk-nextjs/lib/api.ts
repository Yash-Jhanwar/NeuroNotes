import { useAuth } from "@clerk/nextjs";

/**
 * Example Custom Hook for fetching from the backend
 * Usage in a React Component:
 * 
 * const { fetchAPI } = useBackendAPI();
 * const data = await fetchAPI('/api/semesters');
 */
export const useBackendAPI = () => {
  const { getToken } = useAuth();
  const BASE_URL = "http://localhost:5000";

  const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken();
    
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  };

  return { fetchAPI };
};
