import api from './axios-config';

// Authentication API endpoints
const authAPI = {
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
  register: (userData) => api.post('/auth/register', userData),
  validateToken: (token) => api.post('/validate-token', { token }),
  
  // Updated getCurrentUser method to use the exact endpoint from Swagger UI
  getCurrentUser: () => {
    console.log('Fetching user profile data');
    
    // Use the exact endpoint from Swagger UI that works with the token
    return api.get('/v1/interviewer/profile/');
  },
};

export default authAPI;