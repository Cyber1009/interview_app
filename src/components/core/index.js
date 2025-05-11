/**
 * Core components index
 * Provides centralized exports for all core/shared functionality
 */

// Auth components
export { default as ProtectedRoute } from './auth/ProtectedRoute';
export { default as RequireAuth } from './auth/RequireAuth';
export { default as RequireToken } from './auth/RequireToken';
export { default as InterviewerLogin } from './auth/InterviewerLogin';
export { default as Register } from './auth/Register';

// Error handling
export { default as ErrorBoundary } from './error/ErrorBoundary';

// UI components
export { default as NotFound } from './ui/NotFound';
export { default as LoadingOverlay } from './ui/LoadingOverlay';
export { default as CameraPermissions } from './ui/CameraPermissions';

// Theme components were consolidated into the styles directory