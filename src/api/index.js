/**
 * API Service Index
 * 
 * This module serves as the main entry point for all API services.
 * It consolidates domain-specific API modules into a single unified API object
 * while also providing the option to import specific API modules directly.
 * 
 * The API structure follows a domain-driven design approach that aligns with
 * the backend architecture:
 * 
 * - auth: Authentication and user profile management
 * - candidates: Candidate interview functionality
 * - interviewer: Comprehensive interviewer functionality
 * - admin: System administration (uses separate authentication context)
 * - payments: Subscription and payment processing
 * - system: System health and diagnostic endpoints
 */
import authAPI from './domains/auth';
import candidatesAPI from './domains/candidates';
import interviewerAPI from './domains/interviewer';
import adminAPI from './domains/admin';
import paymentsAPI from './domains/payments';
import systemAPI from './domains/system';

// Unified API object
const api = {
  auth: authAPI,
  candidates: candidatesAPI,
  interviewer: interviewerAPI,
  admin: adminAPI,
  payments: paymentsAPI,
  system: systemAPI
};

export default api;

// Also export individual APIs for direct imports if needed
export { authAPI, candidatesAPI, interviewerAPI, adminAPI, paymentsAPI, systemAPI };