import axios from 'axios';
import { API_BASE_URL } from '../config';
import { 
  mockInterviewAPI, 
  mockQuestionAPI, 
  mockTokenAPI, 
  mockConfigAPI 
} from './mockService';

// Create an axios instance with proper base URL and interceptors
const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Determine if we should use mock APIs
// Set to false when connecting to real backend
const USE_MOCKS = false;

// Default backend domain API implementations
const domainInterviewerAPI = {
  // Interview management
  getAllInterviews: () => api.get('/interviewer/interviews'),
  getInterview: (id) => api.get(`/interviewer/interviews/${id}`),
  createInterview: (interviewData) => api.post('/interviewer/interviews', interviewData),
  updateInterview: (id, interviewData) => api.put(`/interviewer/interviews/${id}`, interviewData),
  updateInterviewWithQuestions: (id, completeData) => api.put(`/interviewer/interviews/${id}/bulk-update-questions`, completeData),
  deleteInterview: (id) => api.delete(`/interviewer/interviews/${id}`),
  
  // Question management - updated to use the consolidated edit endpoint
  getQuestionsByInterview: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/questions`),
  addQuestion: (questionData) => {
    const { interviewId, ...data } = questionData;
    return api.post(`/interviewer/interviews/${interviewId}/edit`, {
      action: "add",
      question_data: data
    });
  },
  updateQuestion: (interviewId, questionId, questionData) => 
    api.post(`/interviewer/interviews/${interviewId}/edit`, {
      action: "update",
      question_id: questionId,
      question_data: questionData
    }),
  deleteQuestion: (interviewId, questionId) => 
    api.post(`/interviewer/interviews/${interviewId}/edit`, {
      action: "delete",
      question_id: questionId
    }),
  reorderQuestions: (interviewId, orderUpdates) => 
    api.post(`/interviewer/interviews/${interviewId}/edit`, {
      action: "reorder",
      order_updates: orderUpdates
    }),

  // Token management
  getTokensByInterview: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/tokens`),
  generateToken: (interviewId) => api.post(`/interviewer/interviews/${interviewId}/tokens`),
  generateBulkTokens: (interviewId, count) => api.post(`/interviewer/interviews/${interviewId}/tokens/bulk`, { count }),
  deleteToken: (interviewId, tokenValue) => api.delete(`/interviewer/interviews/${interviewId}/tokens/${tokenValue}`),
  
  // Results management
  getInterviewResults: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/results`),
  getResultDetail: (resultId) => api.get(`/interviewer/results/${resultId}`),
  deleteResult: (interviewId, sessionId) => api.delete(`/interviewer/interviews/${interviewId}/results/${sessionId}`),
  updateResultStatus: (resultId, statusData) => api.patch(`/interviewer/results/${resultId}/status`, statusData),
  
  // Analytics
  getAnalytics: () => api.get('/interviewer/analytics'),
  getInterviewAnalytics: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/analytics`),
};

const domainCandidateAPI = {
  // Updated to match the new consolidated endpoint structure from the backend
  validateToken: (token) => api.post(`/candidates/tokens/${token}`),
  getInterviewByToken: (token) => api.post(`/candidates/tokens/${token}`),
  // Fix: Accept an object parameter with token property, not just the token string
  startInterview: (sessionData) => api.post('/candidates/sessions', sessionData),
  completeInterview: (sessionId) => api.patch(`/candidates/sessions/${sessionId}/complete`),
  saveRecording: (recordingData) => {
    const formData = new FormData();
    formData.append('session_id', recordingData.sessionId);
    formData.append('question_id', recordingData.questionId);
    formData.append('audio_file', recordingData.audioFile);
    
    return api.post('/candidates/recordings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

const domainAuthAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/registration', userData),
  validateToken: () => api.get('/auth/validate'),
  getCurrentUser: () => api.get('/auth/profile'),
  updateUserProfile: (profileData) => api.put('/auth/profile', profileData),
  refreshToken: () => api.post('/auth/refresh'),
  requestPasswordReset: (email) => api.post('/auth/password/reset-request', { email }),
  resetPassword: (resetData) => api.post('/auth/password/reset', resetData),
};

const domainAdminAPI = {
  // Updated to use more specific endpoint naming
  getSystemSettings: () => api.get('/admin/system/settings'),
  updateSystemSettings: (settingsData) => api.put('/admin/system/settings', settingsData),
  getMonitoringData: () => api.get('/admin/system/monitoring'),
  
  // New endpoints for separate configuration domains
  getInterviewConfig: () => api.get('/admin/config/interview'),
  updateInterviewConfig: (configData) => api.put('/admin/config/interview', configData),
  getAdminConfig: () => api.get('/admin/config/system'),
  updateAdminConfig: (configData) => api.put('/admin/config/system', configData),
  getThemeConfig: () => api.get('/admin/config/theme'),
  updateThemeConfig: (configData) => api.put('/admin/config/theme', configData),
};

// Authentication API
export const authAPI = {
  login: (credentials) => {
    // Simple mock login for development
    if (USE_MOCKS) {
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.setItem('authToken', 'mock-auth-token');
          localStorage.setItem('username', credentials.username || 'Interviewer');
          resolve({ data: { token: 'mock-auth-token' }});
        }, 500);
      });
    }
    return domainAuthAPI.login(credentials);
  },
  register: (userData) => domainAuthAPI.register(userData),
  validateToken: (token) => domainAuthAPI.validateToken(token),
  getCurrentUser: () => domainAuthAPI.getCurrentUser(),
  updateUserProfile: (profileData) => domainAuthAPI.updateUserProfile(profileData),
};

// Interview API
export const interviewAPI = USE_MOCKS ? mockInterviewAPI : {
  getAllInterviews: () => domainInterviewerAPI.getAllInterviews(),
  getInterview: (id) => domainInterviewerAPI.getInterview(id),
  createInterview: (interviewData) => domainInterviewerAPI.createInterview(interviewData),
  updateInterview: (id, interviewData) => domainInterviewerAPI.updateInterview(id, interviewData),
  updateInterviewWithQuestions: (id, completeData) => domainInterviewerAPI.updateInterviewWithQuestions(id, completeData),
  deleteInterview: (id) => domainInterviewerAPI.deleteInterview(id),
  
  // Get interview results
  getInterviewResults: (interviewId) => domainInterviewerAPI.getInterviewResults(interviewId),
  getResultDetail: (resultId) => domainInterviewerAPI.getResultDetail(resultId),
  deleteResult: (interviewId, sessionId) => domainInterviewerAPI.deleteResult(interviewId, sessionId),
  updateResultStatus: (resultId, statusData) => domainInterviewerAPI.updateResultStatus(resultId, statusData),
  
  // Analytics
  getAnalytics: () => domainInterviewerAPI.getAnalytics(),
  getInterviewAnalytics: (interviewId) => domainInterviewerAPI.getInterviewAnalytics(interviewId),
  
  // Token operations - make them available through the main API as well
  getTokensByInterview: (interviewId) => domainInterviewerAPI.getTokensByInterview(interviewId),
  generateToken: (interviewId) => domainInterviewerAPI.generateToken(interviewId),
  generateBulkTokens: (interviewId, count) => domainInterviewerAPI.generateBulkTokens(interviewId, count),
  deleteToken: (interviewId, tokenValue) => domainInterviewerAPI.deleteToken(interviewId, tokenValue),
};

// Question API
export const questionAPI = USE_MOCKS ? mockQuestionAPI : {
  getQuestionsByInterview: (interviewId) => domainInterviewerAPI.getQuestionsByInterview(interviewId),
  addQuestion: (questionData) => domainInterviewerAPI.addQuestion(questionData),
  updateQuestion: (interviewId, questionId, questionData) => 
    domainInterviewerAPI.updateQuestion(interviewId, questionId, questionData),
  deleteQuestion: (interviewId, questionId) => domainInterviewerAPI.deleteQuestion(interviewId, questionId),
  reorderQuestions: (interviewId, orderUpdates) => domainInterviewerAPI.reorderQuestions(interviewId, orderUpdates),
};

// Token API
export const tokenAPI = USE_MOCKS ? mockTokenAPI : {
  getTokens: () => {
    // Instead of relying on a default interview ID, return empty array when no interviews exist
    return new Promise((resolve) => {
      resolve({ data: [] });
    });
  },
  getTokensByInterview: (interviewId) => domainInterviewerAPI.getTokensByInterview(interviewId),
  
  generateToken: (interviewId) => {
    if (!interviewId) {
      interviewId = localStorage.getItem('activeInterviewId') || 1;
    }
    return domainInterviewerAPI.generateToken(interviewId);
  },
  
  generateBulkTokens: (interviewId, count) => {
    // Handle the case where count is passed as first parameter
    if (typeof interviewId === 'number' && !count) {
      count = interviewId;
      interviewId = localStorage.getItem('activeInterviewId') || 1;
    } else if (!interviewId) {
      interviewId = localStorage.getItem('activeInterviewId') || 1;
    }
    
    return domainInterviewerAPI.generateBulkTokens(interviewId, count);
  },
  
  deleteToken: (interviewId, tokenValue) => {
    if (!tokenValue) {
      tokenValue = interviewId;
      interviewId = localStorage.getItem('activeInterviewId') || 1;
    }
    return domainInterviewerAPI.deleteToken(interviewId, tokenValue);
  }
};

// Configuration API - enhanced with domain-specific config management
export const configAPI = USE_MOCKS ? mockConfigAPI : {
  // Legacy method - maintained for backward compatibility
  getConfig: () => domainAdminAPI.getSystemSettings(),
  updateConfig: (configData) => {
    // Transform to match SystemConfigUpdate schema from backend
    const transformedConfig = {
      rate_limits: {
        interview: configData.interviewDuration || 30,
        questions: configData.questionsPerInterview || 5,
        retries: configData.maxRetries || 3
      },
      feature_flags: {
        autoEndInterview: configData.autoEndInterview !== undefined ? configData.autoEndInterview : true,
        recordVideo: configData.recordVideo !== undefined ? configData.recordVideo : true
      }
    };
    return domainAdminAPI.updateSystemSettings(transformedConfig);
  },
  
  // New domain-specific config methods
  getInterviewConfig: async () => {
    try {
      const response = await domainAdminAPI.getInterviewConfig();
      // Transform from backend to frontend format
      const backendConfig = response.data;
      return {
        data: {
          interviewDuration: backendConfig.rate_limits?.interview || 30,
          questionsPerInterview: backendConfig.rate_limits?.questions || 5,
          maxRetries: backendConfig.rate_limits?.retries || 3,
          autoEndInterview: backendConfig.feature_flags?.autoEndInterview !== undefined 
            ? backendConfig.feature_flags.autoEndInterview : true,
          recordVideo: backendConfig.feature_flags?.recordVideo !== undefined 
            ? backendConfig.feature_flags.recordVideo : true,
          allowRetake: backendConfig.feature_flags?.allowRetake || false,
          requireCamera: backendConfig.feature_flags?.requireCamera || true,
          requireMic: backendConfig.feature_flags?.requireMic || true,
          showTimer: backendConfig.ui_settings?.showTimer !== undefined 
            ? backendConfig.ui_settings.showTimer : true,
          showProgress: backendConfig.ui_settings?.showProgress !== undefined 
            ? backendConfig.ui_settings.showProgress : true
        }
      };
    } catch (error) {
      console.error('Failed to fetch interview config:', error);
      throw error;
    }
  },
  
  updateInterviewConfig: async (configData) => {
    try {
      // Transform from frontend to backend format
      const transformedConfig = {
        rate_limits: {
          interview: configData.interviewDuration || 30,
          questions: configData.questionsPerInterview || 5,
          retries: configData.maxRetries || 3
        },
        feature_flags: {
          autoEndInterview: configData.autoEndInterview,
          recordVideo: configData.recordVideo,
          allowRetake: configData.allowRetake,
          requireCamera: configData.requireCamera,
          requireMic: configData.requireMic
        },
        ui_settings: {
          showTimer: configData.showTimer,
          showProgress: configData.showProgress
        }
      };
      
      const response = await domainAdminAPI.updateInterviewConfig(transformedConfig);
      return response;
    } catch (error) {
      console.error('Failed to update interview config:', error);
      throw error;
    }
  },
  
  getAdminConfig: async () => {
    try {
      const response = await domainAdminAPI.getAdminConfig();
      const backendConfig = response.data;
      return {
        data: {
          system: {
            maxUsersPerCompany: backendConfig.system?.maxUsersPerCompany || 50,
            maxConcurrentInterviews: backendConfig.system?.maxConcurrentInterviews || 10,
            storageQuotaMB: backendConfig.system?.storageQuotaMB || 5000,
          },
          security: {
            passwordMinLength: backendConfig.security?.passwordMinLength || 8,
            passwordRequireSpecialChar: backendConfig.security?.passwordRequireSpecialChar || true,
            sessionTimeoutMinutes: backendConfig.security?.sessionTimeoutMinutes || 30,
            maxLoginAttempts: backendConfig.security?.maxLoginAttempts || 5,
          },
          features: {
            enableBeta: backendConfig.features?.enableBeta || false,
            enableAIAssistant: backendConfig.features?.enableAIAssistant || true,
            enableBulkImport: backendConfig.features?.enableBulkImport || true
          }
        }
      };
    } catch (error) {
      console.error('Failed to fetch admin config:', error);
      throw error;
    }
  },
  
  updateAdminConfig: async (configData) => {
    try {
      // Pass through as-is - our frontend structure matches backend structure
      const response = await domainAdminAPI.updateAdminConfig(configData);
      return response;
    } catch (error) {
      console.error('Failed to update admin config:', error);
      throw error;
    }
  },
  
  getThemeConfig: async () => {
    try {
      const response = await domainAdminAPI.getThemeConfig();
      return response; // Frontend-friendly format already
    } catch (error) {
      console.error('Failed to fetch theme config:', error);
      throw error;
    }
  },
  
  updateThemeConfig: async (configData) => {
    try {
      const response = await domainAdminAPI.updateThemeConfig(configData);
      return response;
    } catch (error) {
      console.error('Failed to update theme config:', error);
      throw error;
    }
  }
};

// Candidate interview session
export const candidateAPI = {
  validateToken: (token) => domainCandidateAPI.validateToken(token),
  getInterviewByToken: (token) => domainCandidateAPI.getInterviewByToken(token),
  startInterview: (sessionData) => domainCandidateAPI.startInterview(sessionData),
  completeInterview: (sessionId) => domainCandidateAPI.completeInterview(sessionId),
  saveRecording: (recordingData) => domainCandidateAPI.saveRecording(recordingData),
};

export default api;
