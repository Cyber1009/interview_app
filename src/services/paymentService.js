/**
 * Payment Service
 * Handles:
 * - Subscription management
 * - Payment processing
 * - Checkout sessions
 * - Billing portal access
 * - Plan information
 */

import api from './api';
import { ErrorService } from './index';

class PaymentService {
  /**
   * Create a checkout session for registration
   * @param {Object} data - Contains verification_token and plan_id
   * @returns {Promise} - Promise with checkout URL and session ID
   */
  async createCheckoutSession(data) {
    try {
      const response = await api.post('/payments/checkout', data);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to create checkout session', error);
      throw error;
    }
  }

  /**
   * Complete registration after payment
   * @param {Object} data - Contains verification_token and session_id
   * @returns {Promise} - Promise with registration result
   */
  async completeRegistration(data) {
    try {
      const response = await api.post('/payments/complete-registration', data);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to complete registration', error);
      throw error;
    }
  }

  /**
   * Create a customer portal session
   * @returns {Promise} - Promise with portal URL
   */
  async createCustomerPortalSession() {
    try {
      const response = await api.post('/payments/customer-portal');
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to create customer portal session', error);
      throw error;
    }
  }

  /**
   * Get subscription plans
   * @returns {Promise} - Promise with subscription plans
   */
  async getSubscriptionPlans() {
    try {
      const response = await api.get('/payments/plans');
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch subscription plans', error);
      throw error;
    }
  }

  /**
   * Get current subscription info
   * @returns {Promise} - Promise with current subscription info
   */
  async getCurrentSubscription() {
    try {
      const response = await api.get('/payments/subscription');
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch current subscription', error);
      throw error;
    }
  }
}

export default new PaymentService();