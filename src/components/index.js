/**
 * Components barrel file for centralized component exports
 * Organized by domain/feature area to align with backend structure
 */

// ======== Core Components ========
// Auth
export { default as ProtectedRoute } from './core/auth/ProtectedRoute';
export { default as InterviewerLogin } from './core/auth/InterviewerLogin';
export { default as Register } from './core/auth/Register';
export { default as RequireAuth } from './core/auth/RequireAuth';
export { default as RequireToken } from './core/auth/RequireToken';
export { default as AdminLogin } from './core/auth/AdminLogin';

// Error handling
export { default as ErrorBoundary } from './core/error/ErrorBoundary';

// UI components
export { default as NotFound } from './core/ui/NotFound';
export { default as LoadingOverlay } from './core/ui/LoadingOverlay';
export { default as CameraPermissions } from './core/ui/CameraPermissions';

// Theme components have been consolidated into the styles directory

// ======== Layout Components ========
export { default as DashboardLayout } from './interviewer/DashboardLayout';

// ======== Candidate Components ========
export { default as InterviewAccess } from './candidate/InterviewAccess';
export { default as Welcome } from './candidate/Welcome';
export { default as Instructions } from './candidate/Instructions';
export { default as Interview } from './candidate/Interview';
export { default as ThankYou } from './candidate/ThankYou';
export { default as VideoRecorder } from './candidate/VideoRecorder';
export { default as TimerComponent } from './candidate/TimerComponent';
export { default as QuestionDisplay } from './candidate/QuestionDisplay';
export { default as VideoReview } from './candidate/VideoReview';
export { default as ProgressTracker } from './candidate/ProgressTracker';

// ======== Admin Components ========
export { default as AdminPanel } from './admin/AdminPanel';

// ======== Interviewer Components ========
export { default as InterviewerPanel } from './interviewer/InterviewerPanel';
export { default as InterviewerDashboard } from './interviewer/InterviewerDashboard';
export { default as InterviewManager } from './interviewer/InterviewManager';
export { default as ManageQuestions } from './interviewer/ManageQuestions';
export { default as CreateInterview } from './interviewer/CreateInterview';
export { default as InterviewResults } from './interviewer/InterviewResults';
export { default as InterviewList } from './interviewer/InterviewList';
export { default as InterviewAnalytics } from './interviewer/InterviewAnalytics';
export { default as UserProfile } from './interviewer/UserProfile';
export { default as AccessToken } from './interviewer/AccessToken';

// ======== Payment Components ========
export { default as Subscription } from './payment/Subscription';
