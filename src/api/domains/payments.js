import api from '../axios-config';

/**
 * Payments API Service
 * Handles all payment-related operations including checkout sessions,
 * subscription management, and payment history
 */
const paymentsAPI = {
  /**
   * Creates a checkout session for subscription registration
   * @param {string} plan - The subscription plan identifier
   * @param {string} token - Pending user token
   * @returns {Promise} Promise with checkout session details
   */
  createCheckoutSession: (plan, token) => 
    api.post(`/v1/payments/checkout/registration/${plan}?token=${token}`, {}),
  
  /**
   * Completes registration after successful payment
   * @param {string} sessionId - The checkout session ID
   * @param {string} token - Pending user token
   * @returns {Promise} Promise with registration completion status
   */
  completeRegistration: (sessionId, token) => 
    api.post('/v1/payments/checkout/registration-complete', null, {
      params: { session_id: sessionId, token }
    }),
  
  /**
   * Verifies the status of a payment session
   * @param {string} sessionId - The checkout session ID to verify
   * @returns {Promise} Promise with session verification status
   */
  verifyPaymentSession: (sessionId) => 
    api.get(`/v1/payments/checkout/session/${sessionId}`),
  
  /**
   * Gets the current user's subscription details
   * @returns {Promise} Promise with user subscription information
   */
  getUserSubscription: () => 
    api.get('/v1/users/me/subscription'),
  
  /**
   * Updates the user's subscription to a new plan
   * @param {string} newPlan - The new subscription plan identifier
   * @returns {Promise} Promise with updated subscription details
   */
  updateSubscription: (newPlan) => 
    api.put('/v1/users/subscription', { plan: newPlan }),
  
  /**
   * Cancels the user's current subscription
   * @returns {Promise} Promise with cancellation confirmation
   */
  cancelSubscription: () => 
    api.delete('/v1/users/subscription'),
  
  /**
   * Gets the user's payment transaction history
   * @param {Object} options - Pagination and filtering options
   * @param {number} [options.limit=10] - Number of records per page
   * @param {number} [options.page=1] - Page number
   * @returns {Promise} Promise with payment history records
   */
  getPaymentHistory: (options = { limit: 10, page: 1 }) => 
    api.get('/v1/users/payments', { params: options }),
};

export default paymentsAPI;