/**
 * API Error Handler Utility
 * Provides consistent error processing for API responses
 */

/**
 * Processes API errors and provides normalized error objects
 * @param {Error} error - The error from axios
 * @returns {Object} Normalized error object with consistent structure
 * @returns {string} returns.message - Human-readable error message
 * @returns {number} returns.status - HTTP status code (or 0 for network errors)
 * @returns {Object|null} returns.data - Original error data from server if available
 */
export const handleApiError = (error) => {
  // Default error structure
  const processedError = {
    message: 'An unexpected error occurred',
    status: 500,
    data: null
  };
  
  if (error.response) {
    // Server responded with an error status code
    processedError.message = error.response.data.message || error.response.data.detail || error.response.statusText;
    processedError.status = error.response.status;
    processedError.data = error.response.data;
  } else if (error.request) {
    // Request made but no response received
    processedError.message = 'No response received from server';
    processedError.status = 0;
  }
  
  return processedError;
};