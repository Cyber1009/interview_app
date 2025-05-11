import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { handleApiError } from '../utils/error-handler';

/**
 * Create a separate axios instance for admin endpoints
 * This provides proper separation between regular user and admin auth contexts
 */
const adminApi = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,  // Shorter timeout for admin operations
  headers: { 'Content-Type': 'application/json' }
});

// Add admin-specific request interceptor
adminApi.interceptors.request.use(config => {
  // Use a separate admin token for authentication
  const adminToken = localStorage.getItem('adminToken');
  
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  
  return config;
});

// Add response interceptor with admin-specific error handling
adminApi.interceptors.response.use(
  // Return data directly for successful responses
  response => response.data,
  
  // Handle errors
  async (error) => {
    // Log error details for debugging
    if (error.response) {
      console.error('Admin API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
      
      // Handle admin authentication failures
      if (error.response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
        
        // Redirect to admin login if we're in an admin route
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
    } else if (error.request) {
      console.error('Admin API No Response:', error.request);
    } else {
      console.error('Admin API Request Error:', error.message);
    }
    
    // Process the error using our utility
    const processedError = handleApiError(error);
    return Promise.reject(processedError);
  }
);

/**
 * Admin API Service
 * Handles system administration functions with admin-specific authentication
 * Completely isolated from regular user authentication context
 */
const adminAPI = {
  /**
   * Gets a list of all users in the system
   * @returns {Promise} Promise with array of all user accounts
   */
  getAllUsers: () => adminApi.get('/admin/users'),
  
  /**
   * Gets detailed information about a specific user
   * @param {string|number} userId - User ID to retrieve
   * @returns {Promise} Promise with detailed user information
   */
  getUserDetails: (userId) => adminApi.get(`/admin/users/${userId}`),
  
  /**
   * Updates a user's status (active, suspended, etc)
   * @param {string|number} userId - User ID to update
   * @param {string} status - New status value
   * @returns {Promise} Promise with updated user status
   */
  updateUserStatus: (userId, status) => adminApi.patch(`/admin/users/${userId}/status`, { status }),
  
  /**
   * Gets global system settings
   * @returns {Promise} Promise with system settings
   */
  getSystemSettings: () => adminApi.get('/admin/settings'),
  
  /**
   * Updates global system settings
   * @param {Object} settings - Updated settings object
   * @returns {Promise} Promise with updated settings
   */
  updateSystemSettings: (settings) => adminApi.put('/admin/settings', settings),
  
  /**
   * Gets system analytics data
   * @param {Object} params - Analytics query parameters
   * @returns {Promise} Promise with analytics data
   */
  getAnalytics: (params) => adminApi.get('/admin/analytics', { params }),
  
  /**
   * Generates an admin report
   * @param {string} reportType - Type of report to generate
   * @param {Object} dateRange - Date range for the report
   * @returns {Promise} Promise with generated report
   */
  generateReport: (reportType, dateRange) => adminApi.post('/admin/reports', { report_type: reportType, date_range: dateRange }),
};

// Export both the API endpoints object and the raw axios instance
export { adminApi };
export default adminAPI;