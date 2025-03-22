class ErrorService {
  constructor() {
    this.errors = [];
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
