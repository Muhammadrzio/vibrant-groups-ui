
import axios from 'axios';

const API_URL = 'https://nt-shopping-list.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  
  // Add the token to the Authorization header if it exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Also add as x-auth-token as requested
    config.headers['x-auth-token'] = token;
  }
  
  return config;
});

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If we get a 401 error and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear the invalid token
      localStorage.removeItem('token');
      
      // Redirect to login page
      window.location.href = '/login';
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default api;
