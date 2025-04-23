/**
 * Component Export Index
 * Provides:
 * - Centralized component exports
 * - Component categorization
 * - Easy access to all components
 * - Organized module structure
 */

// Admin components
export { default as AdminPanel } from './admin/AdminPanel';
export { default as ConfigManager } from './admin/ConfigManager';

// Auth components
export { default as InterviewerLogin } from './auth/InterviewerLogin';
export { default as RequireAuth } from './auth/RequireAuth';
export { default as RequireToken } from './auth/RequireToken';
export { default as Register } from './auth/Register';

// Interviewer components
export { default as InterviewerPanel } from './interviewer/InterviewerPanel';
export { default as InterviewerDashboard } from './interviewer/InterviewerDashboard';
export { default as InterviewList } from './interviewer/InterviewList';
export { default as CreateInterview } from './interviewer/CreateInterview';
export { default as InterviewAnalytics } from './interviewer/InterviewAnalytics';
export { default as AccessToken } from './interviewer/AccessToken';
export { default as SetQuestion } from './interviewer/SetQuestion';
export { default as SetTheme } from './interviewer/SetTheme';
export { default as InterviewResults } from './interviewer/InterviewResults';

// Candidate components
export { default as Welcome } from './interview/Welcome';
export { default as Instructions } from './interview/Instructions';
export { default as Interview } from './interview/Interview';
export { default as ThankYou } from './interview/ThankYou';
export { default as InterviewAccess } from './interview/InterviewAccess'; 
export { default as ProgressTracker } from './interview/ProgressTracker';
export { default as QuestionDisplay } from './interview/QuestionDisplay';
export { default as TimerComponent } from './interview/TimerComponent';
export { default as VideoRecorder } from './interview/VideoRecorder';
export { default as VideoReview } from './interview/VideoReview';

// Shared components
export { default as LoadingOverlay } from './shared/LoadingOverlay';
export { default as CameraPermissions } from './shared/CameraPermissions';
export { default as ProtectedRoute } from './shared/ProtectedRoute';
export { default as ErrorBoundary } from './shared/ErrorBoundary';
export { default as NotFound } from './shared/NotFound';
export { default as Layout } from './shared/Layout';
