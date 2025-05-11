/**
 * Services Index File
 * 
 * This file re-exports the API services from the api/domains directory
 * to maintain backward compatibility with existing imports
 */

// Import the centralized API
import api, { 
  authAPI, 
  interviewerAPI, 
  candidatesAPI, 
  adminAPI,
  paymentsAPI, 
  systemAPI 
} from '../api';

// Import any remaining services that aren't part of the API domain structure
import ThemeService from './themeService';

// Re-export domains with service naming for backward compatibility
const AuthService = authAPI;
const InterviewService = interviewerAPI;
const AdminService = adminAPI;
const PaymentService = paymentsAPI;

// Export the main api object
export default api;

// Named exports for backward compatibility with existing imports
export {
  AuthService,
  InterviewService,
  AdminService,
  PaymentService,
  ThemeService
};
