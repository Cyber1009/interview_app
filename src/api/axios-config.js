/**
 * API Axios Configuration
 * 
 * Configures the main axios instance used throughout the application
 * for regular user API calls (non-admin functions).
 * 
 * Features:
 * - Base URL configuration from environment
 * - Automatic token inclusion in requests
 * - Comprehensive error handling
 * - Response normalization
 */
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { handleApiError } from './utils/error-handler';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

/**
 * Request interceptor
 * Adds authentication tokens to outgoing requests
 */
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

/**
 * Response interceptor
 * Handles successful responses and errors in a consistent way
 */
api.interceptors.response.use(
  // Return data directly for successful responses
  response => response.data,
  
  // Handle errors
  async (error) => {
    // Log error details for debugging
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
      
      // Handle token expiration (status 401)
      if (error.response.status === 401) {
        // Clear token on authentication failure
        // You might want to add token refresh logic here
        localStorage.removeItem('authToken');
      }
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Request Error:', error.message);
    }
    
    // Process the error using our utility
    const processedError = handleApiError(error);
    return Promise.reject(processedError);
  }
);

export default api;