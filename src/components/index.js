/**
 * Components barrel file for exporting components
 */

// Auth components
export { default as InterviewerLogin } from './auth/InterviewerLogin';
export { default as CandidateLogin } from './CandidateLogin';
export { default as ProtectedRoute } from './ProtectedRoute';

// Candidate flow components
export { default as InterviewAccess } from './interview/InterviewAccess';
export { default as Welcome } from './interview/Welcome';
export { default as Instructions } from './candidate/Instructions';
export { default as Interview } from './candidate/Interview';
export { default as ThankYou } from './candidate/ThankYou';

// Interviewer dashboard components
export { default as InterviewManager } from './interviewer/InterviewManager';
export { default as AccessToken } from './admin/AccessToken';
export { default as SetQuestion } from './interviewer/SetQuestion';
export { default as InterviewResults } from './interviewer/InterviewResults';
export { default as ConfigManager } from './admin/ConfigManager';

// Admin components
export { default as AdminPanel } from './admin/AdminPanel';

// Layout and UI components
export { default as Layout } from './shared/Layout';
export { default as ErrorBoundary } from './shared/ErrorBoundary';
export { default as NotFound } from './shared/NotFound';
