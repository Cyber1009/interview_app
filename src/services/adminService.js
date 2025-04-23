/**
 * Admin Service
 * Handles:
 * - User management
 * - Account activation
 * - Interview management
 * - System configuration
 * - Admin-specific operations
 */

import api from './api';
import { ErrorService } from './index';

class AdminService {
  /**
   * Create a new admin user
   * @param {Object} userData - User data with username and password
   * @returns {Promise} - Promise with user creation result
   */
  async createAdminUser(userData) {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to create admin user', error);
      throw error;
    }
  }

  /**
   * Activate a user account
   * @param {number} userId - User ID to activate
   * @param {Object} activationData - Activation data including subscription details
   * @returns {Promise} - Promise with activation result
   */
  async activateAccount(userId, activationData) {
    try {
      const response = await api.post(`/admin/users/${userId}/activate`, activationData);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to activate account', error);
      throw error;
    }
  }

  /**
   * Get all pending registrations
   * @returns {Promise} - Promise with pending registrations
   */
  async getPendingRegistrations() {
    try {
      const response = await api.get('/admin/registrations/pending');
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch pending registrations', error);
      throw error;
    }
  }

  /**
   * Get all active users
   * @returns {Promise} - Promise with active users
   */
  async getActiveUsers() {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch users', error);
      throw error;
    }
  }

  /**
   * Get interview results
   * @returns {Promise} - Promise with interview results
   */
  async getInterviewResults() {
    try {
      const response = await api.get('/admin/interviews/results');
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch interview results', error);
      throw error;
    }
  }

  /**
   * Create interview access token
   * @param {Object} tokenData - Token data including interview_id
   * @returns {Promise} - Promise with token creation result
   */
  async createInterviewToken(tokenData) {
    try {
      const response = await api.post('/admin/tokens', tokenData);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to create interview token', error);
      throw error;
    }
  }

  /**
   * Get all interview tokens
   * @returns {Promise} - Promise with interview tokens
   */
  async getAllTokens() {
    try {
      const response = await api.get('/admin/tokens');
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch tokens', error);
      throw error;
    }
  }

  /**
   * Delete an interview token
   * @param {string} token - Token value to delete
   * @returns {Promise} - Promise with deletion result
   */
  async deleteToken(token) {
    try {
      const response = await api.delete(`/admin/tokens/${token}`);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to delete token', error);
      throw error;
    }
  }
}

export default new AdminService();