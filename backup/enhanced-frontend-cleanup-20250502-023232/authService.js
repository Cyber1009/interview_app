/**
 * Authentication Service
 * Handles:
 * - User login
 * - Registration
 * - Account activation
 * - Token management
 * - Password operations
 */

import api from './api';
import { ErrorService } from './index';

class AuthService {
  /**
   * Register a new user
   * @param {Object} registrationData - User data with username, email, password and company_name
   * @returns {Promise} - Promise with registration response
   */
  async register(registrationData) {
    try {
      const response = await api.post('/auth/registration', registrationData);
      // Store the verification token for subscription checkout
      if (response.data && response.data.verification_token) {
        localStorage.setItem('pendingToken', response.data.verification_token);
      }
      return response.data;
    } catch (error) {
      ErrorService.handleError('Registration failed', error);
      throw error;
    }
  }

  /**
   * Create checkout session for a subscription plan
   * @param {string} planId - ID of the plan to subscribe to
   * @returns {Promise} - Promise with checkout URL and session ID
   */
  async createCheckoutSession(planId) {
    try {
      const token = localStorage.getItem('pendingToken');
      if (!token) {
        throw new Error('No pending registration found');
      }
      
      const response = await api.post(`/billing/checkout/registration/${planId}?token=${token}`);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to create checkout session', error);
      throw error;
    }
  }

  /**
   * Complete registration after successful payment
   * @param {string} sessionId - Stripe checkout session ID
   * @returns {Promise} - Promise with user account data
   */
  async completeRegistration(sessionId) {
    try {
      const token = localStorage.getItem('pendingToken');
      const url = token 
        ? `/billing/checkout/registration/complete?session_id=${sessionId}&token=${token}`
        : `/billing/checkout/registration/complete?session_id=${sessionId}`;
        
      const response = await api.post(url);
      
      // Clear pending token and set auth token
      if (response.data && response.data.id) {
        localStorage.removeItem('pendingToken');
        
        // If there's an access_token in the response, set it
        if (response.data.access_token) {
          localStorage.setItem('authToken', response.data.access_token);
          const userRole = this._parseUserRole(response.data.access_token);
          localStorage.setItem('userRole', userRole || 'interviewer');
        }
      }
      
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to complete registration', error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {Object} credentials - User credentials with username and password
   * @returns {Promise} - Promise with login response including token
   */
  async login(credentials) {
    try {
      // Always check for mock credentials first in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using development mode auth checks');
        
        // Mock admin login
        if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
          console.log('Mock admin login successful');
          const mockToken = 'mock-admin-token-' + Date.now();
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('userRole', 'admin');
          sessionStorage.setItem('freshLogin', 'true');
          return { 
            access_token: mockToken, 
            role: 'admin',
            message: 'Mock admin login successful' 
          };
        }
        
        // Mock interviewer login
        if (credentials.email === 'interviewer@example.com' && credentials.password === 'password123') {
          console.log('Mock interviewer login successful');
          const mockToken = 'mock-interviewer-token-' + Date.now();
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('userRole', 'interviewer');
          sessionStorage.setItem('freshLogin', 'true');
          return { 
            access_token: mockToken, 
            role: 'interviewer',
            message: 'Mock interviewer login successful' 
          };
        }
        
        // Mock pending account for demo purposes
        if (credentials.email === 'pending@example.com' && credentials.password === 'pending123') {
          console.log('Mock pending account login');
          const pendingToken = 'mock-pending-token-' + Date.now();
          localStorage.setItem('pendingToken', pendingToken);
          localStorage.setItem('userRole', 'pending');
          return {
            pending_token: pendingToken,
            status: 'pending',
            message: 'Account requires payment to activate',
            requiresPayment: true
          };
        }
      }
      
      // Try real API call if mock credentials failed or we're in production
      console.log('Attempting real API login');
      
      // Special handling for FastAPI's OAuth2PasswordRequestForm format
      // FastAPI expects form data, not JSON for the standard OAuth2 password flow
      const formData = new FormData();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      
      // Use URLSearchParams format which is what FastAPI expects
      const requestBody = new URLSearchParams();
      requestBody.append('username', credentials.email);
      requestBody.append('password', credentials.password);
      
      console.log('Sending login request with form data');
      
      // The correct endpoint URL and request format based on FastAPI OAuth2 requirements
      const response = await api.post('/auth/login', requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.log('API login response:', response);
      
      // IMPORTANT: The axios interceptor in axios-config.js already
      // transforms the response by returning response.data directly
      // So 'response' is already the data object, not an axios response object
      
      if (response && response.status === 'pending') {
        // Handle pending account that needs payment
        console.log('Account requires payment to activate');
        localStorage.setItem('pendingToken', response.pending_token);
        localStorage.setItem('userRole', 'pending');
        return {
          ...response,
          requiresPayment: true
        };
      } else if (response && response.access_token) {
        // Store token in localStorage for app-wide access
        localStorage.setItem('authToken', response.access_token);
        
        // Parse and store role
        const userRole = this._parseUserRole(response.access_token);
        localStorage.setItem('userRole', userRole);
        
        // Set fresh login indicator
        sessionStorage.setItem('freshLogin', 'true');
        
        return {
          ...response,
          role: userRole
        };
      } else if (response && response.token) {
        // Alternative token field name
        localStorage.setItem('authToken', response.token);
        
        // Use provided role or parse from token
        const userRole = response.role || this._parseUserRole(response.token);
        localStorage.setItem('userRole', userRole);
        
        // Set fresh login indicator
        sessionStorage.setItem('freshLogin', 'true');
        
        return {
          access_token: response.token,
          role: userRole,
          ...response
        };
      } else if (response && response.token_type === 'bearer' && response.access_token) {
        // Standard FastAPI OAuth2 response format
        localStorage.setItem('authToken', response.access_token);
        
        // Parse and store role
        const userRole = this._parseUserRole(response.access_token);
        localStorage.setItem('userRole', userRole);
        
        // Set fresh login indicator
        sessionStorage.setItem('freshLogin', 'true');
        
        return {
          ...response,
          role: userRole
        };
      } else {
        console.error('Unrecognized response format:', response);
        throw new Error('Invalid response format from authentication server');
      }
    } catch (error) {
      console.error("Login error details:", error);
      
      // Check for specific error types
      if (error.response && error.response.status === 402) {
        // Payment required error
        console.log('Account requires payment');
        
        if (error.response.data && error.response.data.pending_token) {
          localStorage.setItem('pendingToken', error.response.data.pending_token);
          localStorage.setItem('userRole', 'pending');
          
          return {
            status: 'pending',
            message: error.response.data.message || 'Account requires payment to activate',
            requiresPayment: true,
            pending_token: error.response.data.pending_token
          };
        }
      }
      
      // Try mock login as fallback in development if backend is unreachable
      if (process.env.NODE_ENV !== 'production' && (error.message.includes('Network Error') || error.code === 'ECONNREFUSED')) {
        console.log('Backend unreachable, trying fallback mock auth');
        return this.login(credentials); // Re-try with mock auth
      }
      
      ErrorService.handleError('Login failed', error);
      throw error;
    }
  }
  
  /**
   * Get user profile information
   * @returns {Promise} - Promise with user profile data
   */
  async getUserProfile() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch user profile', error);
      throw error;
    }
  }
  
  /**
   * Change password
   * @param {Object} passwordData - Contains current_password and new_password
   * @returns {Promise} - Promise with password change result
   */
  async changePassword(passwordData) {
    try {
      const response = await api.post('/auth/password', passwordData);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Password change failed', error);
      throw error;
    }
  }
  
  /**
   * Create customer portal session for managing subscription
   * @returns {Promise} - Promise with portal URL
   */
  async createCustomerPortalSession() {
    try {
      const response = await api.post('/billing/checkout/customer-portal');
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to create customer portal session', error);
      throw error;
    }
  }
  
  /**
   * Logout user and redirect to login page
   * @param {function} navigate - React Router navigate function (optional)
   */
  logout(navigate = null) {
    console.log('Logging out user...');
    
    // First, store a flag in sessionStorage to indicate we're in logout process
    // This is more reliable than state params which can get lost in redirects
    sessionStorage.setItem('explicit_logout', 'true');
    
    // Clear all auth-related data from storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('pendingToken');
    localStorage.removeItem('userRole');
    
    // If navigate function is provided, redirect to login with state
    if (navigate) {
      navigate('/interviewer/login', { 
        replace: true, 
        state: { 
          loggedOut: true,
          message: 'You have been logged out successfully.'
        } 
      });
    }
  }
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated, false otherwise
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
  
  /**
   * Check if user has a pending account requiring payment
   * @returns {boolean} - True if pending payment required, false otherwise
   */
  hasPendingAccount() {
    return !this.isAuthenticated() && !!localStorage.getItem('pendingToken');
  }
  
  /**
   * Check if token is valid
   * @returns {boolean} - True if token is valid, false otherwise
   */
  hasValidToken() {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
      // Basic check for token expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Get authentication token
   * @returns {string|null} - Auth token or null if not found
   */
  getToken() {
    return localStorage.getItem('authToken');
  }
  
  /**
   * Get pending token
   * @returns {string|null} - Pending token or null if not found
   */
  getPendingToken() {
    return localStorage.getItem('pendingToken');
  }
  
  /**
   * Get user role from token or localStorage
   * @returns {string|null} - User role or null if not found
   */
  getUserRole() {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) return storedRole;
    
    const token = this.getToken();
    if (!token) return null;
    
    const role = this._parseUserRole(token);
    if (role) localStorage.setItem('userRole', role);
    return role;
  }
  
  /**
   * Parse user role from JWT token
   * @param {string} token - JWT token
   * @returns {string|null} - User role or null if parsing fails
   * @private
   */
  _parseUserRole(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT payload:', payload);
      
      // Try different common JWT claim names for roles
      const role = 
        payload.role || 
        payload.user_role || 
        payload.userRole || 
        payload.roles?.[0] || 
        (payload.scope && payload.scope.includes('admin') ? 'admin' : null) ||
        (payload.scope && payload.scope.includes('interviewer') ? 'interviewer' : null);
      
      // If token contains user info, check if username contains 'admin'
      if (!role && payload.sub && payload.sub.includes('admin')) {
        return 'admin';
      }
      
      return role || 'interviewer'; // Default to interviewer if no role found
    } catch (e) {
      console.error('Error parsing JWT token:', e);
      return null;
    }
  }
}

export default new AuthService();
