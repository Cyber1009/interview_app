import api from '../axios-config';

/**
 * System API endpoints
 * Provides access to system-level information, health checks, and metrics
 * Aligned with your backend system domain
 */
const systemAPI = {
  /**
   * Get system health status
   * @returns {Promise} Promise with health check results
   */
  getHealthStatus: () => api.get('/system/health'),
  
  /**
   * Get system information including version, environment, and uptime
   * @returns {Promise} Promise with system information
   */
  getSystemInfo: () => api.get('/system/info'),
  
  /**
   * Get current API version information
   * @returns {Promise} Promise with API version details
   */
  getApiVersion: () => api.get('/system/version'),
  
  /**
   * Get system metrics for monitoring
   * @param {Object} options - Filter options for metrics
   * @returns {Promise} Promise with system metrics
   */
  getMetrics: (options = {}) => api.get('/system/metrics', { params: options }),
  
  /**
   * Check the status of background tasks
   * @returns {Promise} Promise with background task status
   */
  getTaskStatus: () => api.get('/system/tasks'),
};

export default systemAPI;