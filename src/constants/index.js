/**
 * Constants Export Module
 * Centralizes:
 * - Application constants
 * - Configuration exports
 * - Version information
 * - Feature flags and limits
 */

/**
 * Central export point for all constants and configurations
 */

export {
  AUTH_CONFIG,
  AUTH_ENDPOINTS,
  AUTH_ERRORS,
  ROLES
} from './config';

export const APP_VERSION = '1.0.0';

export const INTERVIEW_CONSTANTS = {
  MIN_PREP_TIME: 30,
  MAX_PREP_TIME: 300,
  MIN_RECORD_TIME: 60,
  MAX_RECORD_TIME: 600,
  DEFAULT_TOKEN_LENGTH: 6
};
