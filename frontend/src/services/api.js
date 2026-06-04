import axios from 'axios';
import { env } from '../config/env';

const api = axios.create({
  baseURL: env.apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Bhejte waqt token attach karo
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Aate waqt errors handle karo
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Agar status 401 hai aur user pehle se login page par NAHI hai
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Safe redirect without infinite loops
      window.location.href = env.routes.login || '/login';
    }
    return Promise.reject(error);
  }
);

export default api;