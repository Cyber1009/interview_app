import api from '../axios-config';

/**
 * Authentication API Service
 * Handles user authentication, registration, and profile management
 */
const authAPI = {
  /**
   * Authenticates a user with their credentials
   * @param {Object} credentials - User login credentials
   * @param {string} [credentials.email] - User's email
   * @param {string} [credentials.password] - User's password
   * @returns {Promise} Promise with authentication result and token
   */
  login: (credentials) => {
    // If credentials have email/username and password, convert to FormData for OAuth2 compatibility
    if (credentials.email && credentials.password) {
      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      
      return api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
    }
    // Fall back to JSON if formData structure is not appropriate
    return api.post('/auth/login', credentials);
  },

  /**
   * Registers a new user
   * @param {Object} userData - New user registration data
   * @returns {Promise} Promise with registration result
   */
  register: (userData) => api.post('/auth/registration', userData),

  /**
   * Validates an authentication token
   * @param {string} token - Token to validate
   * @returns {Promise} Promise with token validation result
   */
  validateToken: (token) => api.post('/candidates/tokens/verify', { token }),
  
  /**
   * Gets the currently authenticated user's profile
   * @returns {Promise} Promise with current user data
   */
  getCurrentUser: () => {
    console.log('Fetching user profile data');
    return api.get('/interviewer/profile', {
      headers: {
        'Accept': 'application/json'
      },
      // Include timestamp to prevent caching issues
      params: {
        _t: new Date().getTime()
      }
    });
  },
  
  /**
   * Updates the current user's profile information
   * @param {Object} profileData - Updated profile information
   * @returns {Promise} Promise with updated profile data
   */
  updateUserProfile: (profileData) => {
    console.log('Updating user profile data', profileData);
    // For user's own profile, use the interviewer profile endpoint
    // This doesn't need a user_id in the path as it uses the authenticated user
    return api.put('/interviewer/profile', profileData);
  },
};

export default authAPI;