/**
 * Admin Authentication Service
 * Handles:
 * - Admin login
 * - Admin session management
 * - Admin authorization checks
 * 
 * This service is separate from the regular AuthService to maintain
 * a clear separation between admin and regular user authentication.
 */

import { adminApi } from '../api/domains/admin';
import ErrorService from './errorService';

class AdminAuthService {
  /**
   * Authenticate an admin user
   * @param {Object} credentials - Admin login credentials
   * @returns {Promise} - Promise with login result
   */
  async login(credentials) {
    try {
      // For FastAPI's OAuth2 password flow, we need to use form data
      const requestBody = new URLSearchParams();
      requestBody.append('username', credentials.username);
      requestBody.append('password', credentials.password);
      
      console.log('AdminAuthService: Sending admin login request with form data');
      
      const response = await adminApi.post('/admin/auth/login', requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.log('AdminAuthService: Admin login response:', response);
      
      // IMPORTANT: The axios interceptor in admin-config.js already returns response.data
      // So 'response' is already the data object, not an axios response object
      
      if (response && response.access_token) {
        // Store admin token separately from regular user tokens
        localStorage.setItem('adminToken', response.access_token);
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminUsername', credentials.username || response.username);
        
        if (response.admin_id) {
          localStorage.setItem('adminId', response.admin_id);
        }
        
        // Set a fresh login flag to trigger automatic navigation if needed
        sessionStorage.setItem('freshAdminLogin', 'true');
        
        return response;
      } else {
        console.error('AdminAuthService: Unrecognized admin login response format:', response);
        throw new Error('Invalid admin authentication response');
      }
    } catch (error) {
      console.error('AdminAuthService: Login error details:', error);
      ErrorService.handleError('Admin login failed', error);
      throw error;
    }
  }

  /**
   * Change admin password
   * @param {Object} passwordData - Current and new password
   * @returns {Promise} - Promise with result
   */
  async changePassword(passwordData) {
    try {
      const response = await adminApi.post('/admin/auth/change-password', passwordData);
      return response;
    } catch (error) {
      ErrorService.handleError('Failed to change password', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated as admin
   * @returns {Boolean} - True if user is authenticated as admin
   */
  isAuthenticated() {
    return !!localStorage.getItem('adminToken');
  }

  /**
   * Log out the admin user
   */
  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminId');
  }

  /**
   * Get admin user information
   * @returns {Object} - Admin user info
   */
  getAdminInfo() {
    return {
      username: localStorage.getItem('adminUsername') || 'Admin',
      id: localStorage.getItem('adminId'),
      isAdmin: true
    };
  }
}

// Create an instance of the AdminAuthService class
const adminAuthServiceInstance = new AdminAuthService();

export default adminAuthServiceInstance;