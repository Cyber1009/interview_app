/**
 * Authentication Service
 * Manages all authentication-related functionality:
 * - User session management
 * - Token-based authentication
 * - Role-based access control
 * - API request interceptors for auth headers
 * - Token refresh mechanism
 */

import { AUTH_CONFIG } from '../utils/auth';
import axios from 'axios';

class AuthService {
  // Session management
  setSession(token, role, expiresIn = 3600000) {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    localStorage.setItem(AUTH_CONFIG.ROLE_KEY, role);
    localStorage.setItem(AUTH_CONFIG.EXPIRES_KEY, 
      new Date(Date.now() + expiresIn).toISOString()
    );
  }

  clearSession() {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.ROLE_KEY);
    localStorage.removeItem(AUTH_CONFIG.EXPIRES_KEY);
    localStorage.removeItem(AUTH_CONFIG.INTERVIEW_TOKEN);
  }

  isAuthenticated() {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    const expiresAt = localStorage.getItem(AUTH_CONFIG.EXPIRES_KEY);
    
    if (!token || !expiresAt) return false;
    return new Date(expiresAt) > new Date();
  }

  // Role-based access control
  hasRole(requiredRole) {
    const userRole = localStorage.getItem(AUTH_CONFIG.ROLE_KEY);
    
    switch (requiredRole) {
      case 'admin':
        return userRole === 'admin';
      case 'interviewer':
        return userRole === 'interviewer' || userRole === 'admin';
      case 'candidate':
        const interviewToken = localStorage.getItem(AUTH_CONFIG.INTERVIEW_TOKEN);
        return userRole === 'candidate' && interviewToken;
      default:
        return false;
    }
  }

  async login(email, password) {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, refreshToken, role, expiresIn } = response.data;
      this.setSession(token, role, expiresIn);
      localStorage.setItem('refreshToken', refreshToken);
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await axios.post('/api/auth/refresh', { refreshToken });
      const { token, newRefreshToken, expiresIn } = response.data;
      
      this.setSession(token, this.getRole(), expiresIn);
      localStorage.setItem('refreshToken', newRefreshToken);
      return token;
    } catch (error) {
      this.clearSession();
      throw error;
    }
  }

  getRole() {
    return localStorage.getItem(AUTH_CONFIG.ROLE_KEY);
  }

  handleAuthError(error) {
    console.error('Auth error:', error);
    if (error.response?.status === 401) {
      this.clearSession();
    }
  }

  // Axios interceptor setup
  setupInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const token = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }
}

export default new AuthService();
