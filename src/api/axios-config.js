import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8000/api'
});

// Add auth token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  const pendingToken = localStorage.getItem('pendingToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (pendingToken && config.url.includes('/payments/checkout')) {
    // For payment endpoints, include the pending token if no auth token is available
    // This ensures payment API calls work with pending accounts
    console.log('Using pending token for request:', config.url);
    // Add the pending token to the URL if it's not already there
    if (!config.params) config.params = {};
    if (!config.params.token && !config.url.includes('token=')) {
      config.params.token = pendingToken;
    }
  }
  
  return config;
});

// Add response interceptor for better error logging
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config.url
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;