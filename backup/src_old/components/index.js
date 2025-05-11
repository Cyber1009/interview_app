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
export { default as ThemeSwitcher } from './admin/SetTheme';

// Interview components
export { default as Interview } from './interview/Interview';
export { default as Instructions } from './interview/Instructions';
export { default as Welcome } from './interview/Welcome';
export { default as VideoRecorder } from './interview/VideoRecorder';
export { default as VideoReview } from './interview/VideoReview';
export { default as ThankYou } from './interview/ThankYou';
export { default as InterviewAccess } from './interview/InterviewAccess';
export { default as ProgressTracker } from './interview/ProgressTracker';
export { default as QuestionDisplay } from './interview/QuestionDisplay';
export { default as TimerComponent } from './interview/TimerComponent';

// Shared components
export { default as LoadingOverlay } from './shared/LoadingOverlay';
export { default as CameraPermissions } from './shared/CameraPermissions';
export { default as ProtectedRoute } from './shared/ProtectedRoute';
