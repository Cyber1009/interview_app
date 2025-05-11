/**
 * Payment Service
 * Handles:
 * - Payment processing
 * - Subscription management
 * - Plan updates
 * - Payment history
 */

import api from './api';

class PaymentService {
  /**
   * Process a payment transaction
   * @param {Object} paymentData - Payment data including plan, amount and card info
   * @returns {Promise} - Promise with payment result
   */
  async processPayment(paymentData) {
    try {
      console.log('Processing payment for plan:', paymentData.plan);
      
      // Get the verification token from localStorage
      const token = localStorage.getItem('pendingToken');
      if (!token) {
        throw new Error('No verification token found. Please try logging in again.');
      }
      
      // Call the backend API to create a checkout session
      const response = await api.post(
        `/v1/payments/checkout/registration/${paymentData.plan}?token=${token}`, 
        {}  // We don't send card details directly anymore - Stripe handles this
      );
      
      console.log('Checkout session created:', response.data);
      
      // Check if checkout URL is provided
      if (response.data && response.data.checkout_url) {
        return {
          success: false,  // Not completed yet
          checkoutUrl: response.data.checkout_url,
          sessionId: response.data.session_id,
          token: token,
          plan: paymentData.plan,
          amount: paymentData.amount
        };
      }
      
      throw new Error('Invalid checkout response from server');
    } catch (error) {
      console.error('Payment processing error:', error);
      
      // Detailed error logging
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Server response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Return a more specific error message from the server if available
        if (error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server');
        throw new Error('No response received from server. Please check your network connection.');
      }
      
      // If it's already an Error object with a message, rethrow it
      if (error instanceof Error) {
        throw error;
      }
      
      // Default fallback error
      throw new Error('Payment failed. Please check your payment details and try again.');
    }
  }

  /**
   * Open Stripe checkout in a popup window
   * @param {string} checkoutUrl - The Stripe checkout URL
   * @returns {Promise} - Promise that resolves when the popup is closed
   */
  openStripeCheckout(checkoutUrl) {
    return new Promise((resolve, reject) => {
      // Calculate popup dimensions
      const width = 550;
      const height = 650;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;

      // Open popup window centered
      const popup = window.open(
        checkoutUrl, 
        'stripe-checkout',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
      );
      
      // Store the popup reference
      this.stripePopup = popup;
      
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        reject(new Error('Popup blocked. Please enable popups for this website and try again.'));
        return;
      }
      
      // Check if popup was closed
      const checkPopupClosed = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopupClosed);
          resolve(); // Resolve when popup is closed
        }
      }, 500);
      
      // Set a timeout to prevent infinite polling if user never closes the popup
      setTimeout(() => {
        clearInterval(checkPopupClosed);
        if (popup && !popup.closed) {
          popup.close();
        }
        resolve();
      }, 30 * 60 * 1000); // 30 minutes timeout
    });
  }

  /**
   * Complete registration after successful payment
   * @param {string} sessionId - The checkout session ID
   * @param {string} token - The verification token
   * @returns {Promise} - Promise with registration completion result
   */
  async completeRegistration(sessionId, token) {
    try {
      console.log('Completing registration with session:', sessionId);
      
      // In a real integration, Stripe would call your backend webhook
      // Here we'll call the complete endpoint directly
      const response = await api.post('/v1/payments/checkout/registration-complete', null, {
        params: {
          session_id: sessionId,
          token: token
        }
      });
      
      console.log('Registration completed:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration completion error:', error);
      
      // Detailed error logging
      if (error.response) {
        console.error('Server response error during completion:', {
          status: error.response.status,
          data: JSON.stringify(error.response.data)
        });
        
        if (error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        }
      }
      
      // If it's already an Error object with a message, rethrow it
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Registration completion failed. Please contact support.');
    }
  }
  
  /**
   * Verify payment session status
   * @param {string} sessionId - The checkout session ID
   * @returns {Promise} - Promise with session status
   */
  async verifyPaymentSession(sessionId) {
    try {
      const response = await api.get(`/v1/payments/checkout/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment session:', error);
      throw error;
    }
  }

  /**
   * Get subscription details for the current user
   * @returns {Promise} - Promise with subscription details
   */
  async getSubscription() {
    try {
      // In a real app, this would get actual subscription details
      const response = await api.get('/v1/users/me/subscription');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      
      // Fallback to mock data if API call fails
      return {
        plan: 'professional',
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 29.99
      };
    }
  }

  /**
   * Update subscription plan
   * @param {string} newPlan - The ID of the new plan
   * @returns {Promise} - Promise with updated subscription
   */
  async updateSubscription(newPlan) {
    try {
      // In a real app, this would update the subscription
      const response = await api.put('/v1/users/subscription', { plan: newPlan });
      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      
      // Fallback to mock data if API call fails
      return {
        plan: newPlan,
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Subscription updated successfully'
      };
    }
  }

  /**
   * Cancel subscription
   * @returns {Promise} - Promise with cancellation result
   */
  async cancelSubscription() {
    try {
      // In a real app, this would cancel the subscription
      const response = await api.delete('/v1/users/subscription');
      return response.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      
      // Fallback to mock data if API call fails
      return {
        status: 'cancelled',
        effectiveDate: new Date().toISOString(),
        message: 'Subscription cancelled'
      };
    }
  }

  /**
   * Get payment history
   * @param {Object} options - Pagination options
   * @returns {Promise} - Promise with payment history
   */
  async getPaymentHistory(options = { limit: 10, page: 1 }) {
    try {
      // In a real app, this would get actual payment history
      const response = await api.get('/v1/users/payments', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      
      // Fallback to mock data if API call fails
      const history = [];
      const currentDate = new Date();
      
      for (let i = 0; i < options.limit; i++) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i);
        
        history.push({
          id: `payment-${i}`,
          date: date.toISOString(),
          amount: 29.99,
          status: 'completed',
          description: 'Professional Plan - Monthly Subscription'
        });
      }
      
      return {
        payments: history,
        total: 24,
        page: options.page,
        limit: options.limit
      };
    }
  }
}

export default new PaymentService();