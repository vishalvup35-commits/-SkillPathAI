import axios from 'axios';

// Works whether VITE_API_URL is "https://site.com", "https://site.com/api", or "/api"
const raw = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const baseURL = raw.endsWith('/api') ? raw : `${raw}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;