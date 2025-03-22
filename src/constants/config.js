/**
 * Application Configuration Constants
 * Defines:
 * - Authentication configuration
 * - API endpoints
 * - Error messages
 * - User role definitions
 * - Application-wide settings
 */

export const AUTH_CONFIG = {
  TOKEN_KEY: 'authToken',
  ROLE_KEY: 'userRole',
  EXPIRES_KEY: 'expiresAt',
  INTERVIEW_TOKEN: 'interviewToken'
};

export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REFRESH: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout'
};

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  SESSION_EXPIRED: 'Session expired',
  UNAUTHORIZED: 'Unauthorized access',
  NETWORK_ERROR: 'Network error occurred'
};

export const ROLES = {
  ADMIN: 'admin',
  INTERVIEWER: 'interviewer',
  CANDIDATE: 'candidate'
};
