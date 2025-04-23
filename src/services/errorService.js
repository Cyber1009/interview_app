/**
 * Error Service
 * Handles:
 * - Error logging
 * - Error message formatting
 * - Error reporting
 * - Consistent error handling across the application
 */

class ErrorService {
  constructor() {
    this.errors = [];
  }

  /**
   * Handle API and service errors
   * @param {string} message - Error context message
   * @param {Error} error - Error object
   */
  handleError(message, error) {
    console.error(`${message}: `, error);
    
    // Extract error message from API response if available
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    
    // Here you could add error notification logic, error reporting, etc.
    this.notifyUser(errorMessage);
  }
  
  /**
   * Show error notification to user
   * @param {string} message - Error message to display
   */
  notifyUser(message) {
    // This could be implemented with a toast notification library
    // For now just using console.error
    console.error('ERROR: ' + message);
    
    // Example event dispatch for global error handling
    const errorEvent = new CustomEvent('app-error', { 
      detail: { message } 
    });
    window.dispatchEvent(errorEvent);
  }
  
  /**
   * Format error for logging
   * @param {Error} error - Error object
   * @returns {string} - Formatted error message
   */
  formatError(error) {
    if (error.response) {
      // API error with response
      return `API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      // Network error
      return `Network Error: No response received`;
    } else {
      // Other error
      return `Error: ${error.message}`;
    }
  }
  
  /**
   * Log error to external service (placeholder)
   * @param {Error} error - Error object
   * @param {string} context - Error context
   */
  logToService(error, context) {
    // This would connect to an external error logging service
    // Example: Sentry.captureException(error);
    console.error(`[Error Log] ${context}:`, this.formatError(error));
  }

  logError(error, context = '') {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
    };

    this.errors.push(errorLog);
    console.error(`Error in ${context}:`, error);

    // Could integrate with external logging service here
    if (process.env.NODE_ENV === 'production') {
      // Send to external logging service
    }
  }

  getLastError() {
    return this.errors[this.errors.length - 1];
  }

  clearErrors() {
    this.errors = [];
  }
}

export default new ErrorService();
