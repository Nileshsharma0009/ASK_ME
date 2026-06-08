import axios from 'axios';
import { env } from '../config/env';

// Create the Axios instance
const api = axios.create({
  baseURL: env.apiBase,
  timeout: 15000, // Increased timeout to handle Render's cold starts
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Fix for JSON serialization: 
// Explicitly ensure data is stringified correctly before sending
api.defaults.transformRequest = [function (data, headers) {
  if (data && typeof data === 'object' && !(data instanceof FormData)) {
    return JSON.stringify(data);
  }
  return data;
}];

// Request Interceptor: Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debugging: Log every request made
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors and 401s
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Debugging: Log every error
    // console.error(`[API Error]:`, error.response?.status, error.response?.data);

    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.clear();
      window.location.href = env.routes.login || '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;