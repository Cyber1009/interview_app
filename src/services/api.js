import axios from 'axios';
import { API_BASE_URL } from '../config';
import { 
  mockInterviewAPI, 
  mockQuestionAPI, 
  mockTokenAPI, 
  mockConfigAPI 
} from './mockService';

// Determine if we should use mock APIs
const USE_MOCKS = false; // Set to false when real backend is available

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8000/api'
});

// Add auth token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  const pendingToken = localStorage.getItem('pendingToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (pendingToken && config.url.includes('/payments/checkout')) {
    // For payment endpoints, include the pending token if no auth token is available
    // This ensures payment API calls work with pending accounts
    console.log('Using pending token for request:', config.url);
    // Add the pending token to the URL if it's not already there
    if (!config.params) config.params = {};
    if (!config.params.token && !config.url.includes('token=')) {
      config.params.token = pendingToken;
    }
  }
  
  return config;
});

// Add response interceptor for better error logging
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config.url
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

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
    return api.post('/auth/login', credentials);
  },
  register: (userData) => api.post('/auth/register', userData),
  validateToken: (token) => api.post('/validate-token', { token }),
};

// Interview API
export const interviewAPI = USE_MOCKS ? mockInterviewAPI : {
  // Interview management
  getAllInterviews: () => api.get('/interviewer/interviews'),
  getInterview: (id) => api.get(`/interviewer/interviews/${id}`),
  createInterview: (interviewData) => api.post('/interviewer/interviews', interviewData),
  updateInterview: (id, interviewData) => api.put(`/interviewer/interviews/${id}`, interviewData),
  deleteInterview: (id) => api.delete(`/interviewer/interviews/${id}`),
  
  // Get interview results
  getInterviewResults: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/results`),
  getResultDetail: (resultId) => api.get(`/interviewer/results/${resultId}`),
  deleteResult: (resultId) => api.delete(`/interviewer/results/${resultId}`),
  updateResultStatus: (resultId, statusData) => api.patch(`/interviewer/results/${resultId}/status`, statusData),
};

// Question API
export const questionAPI = USE_MOCKS ? mockQuestionAPI : {
  getQuestionsByInterview: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/questions`),
  addQuestion: (questionData) => {
    const { interviewId, ...data } = questionData;
    return api.post(`/interviewer/interviews/${interviewId}/questions`, data);
  },
  updateQuestion: (id, questionData) => api.put(`/interviewer/questions/${id}`, questionData),
  deleteQuestion: (id) => api.delete(`/interviewer/questions/${id}`),
  reorderQuestions: (interviewId, questionIds) => api.post(`/interviewer/interviews/${interviewId}/questions/reorder`, { questionIds }),
};

// Token API
export const tokenAPI = USE_MOCKS ? 
  // Mock implementation for development/testing
  {
    getTokens: () => {
      // For now, just use the first interview's tokens (id: 1)
      const defaultInterviewId = 1;
      return mockTokenAPI.getTokensByInterview(defaultInterviewId);
    },
    generateToken: () => mockTokenAPI.generateToken(1),
    generateBulkTokens: (count) => mockTokenAPI.generateBulkTokens(1, count),
    getTokensByInterview: mockTokenAPI.getTokensByInterview,
    deleteToken: mockTokenAPI.deleteToken,
    backendGenerateTokens: (interviewId, count) => 
      new Promise(resolve => setTimeout(() => {
        resolve({ 
          data: Array(count).fill().map((_, i) => ({
            id: `mock-${Date.now()}-${i}`,
            token_value: `MOCK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            interview_id: interviewId,
            is_used: false,
            created_at: new Date().toISOString()
          }))
        });
      }, 500))
  } 
  : 
  {
    getTokens: () => {
      // Get the most recent interview ID from local storage or use default
      const activeInterviewId = localStorage.getItem('activeInterviewId') || 1;
      return api.get(`/interviewer/interviews/${activeInterviewId}/tokens`);
    },
    getTokensByInterview: (interviewId) => 
      api.get(`/interviewer/interviews/${interviewId}/tokens`),
    
    generateToken: (interviewId) => {
      if (!interviewId) {
        interviewId = localStorage.getItem('activeInterviewId') || 1;
      }
      return api.post(`/interviewer/interviews/${interviewId}/tokens`);
    },
    
    generateBulkTokens: (interviewId, count) => {
      // Handle the case where count is passed as first parameter
      if (typeof interviewId === 'number' && !count) {
        count = interviewId;
        interviewId = localStorage.getItem('activeInterviewId') || 1;
      } else if (!interviewId) {
        interviewId = localStorage.getItem('activeInterviewId') || 1;
      }
      
      return api.post(`/interviewer/interviews/${interviewId}/tokens/bulk`, { count });
    },
    
    backendGenerateTokens: (interviewId, count = 1) => {
      if (!interviewId) {
        interviewId = localStorage.getItem('activeInterviewId') || 1;
      }
      return api.post(`/interviewer/interviews/${interviewId}/generate-tokens`, { count });
    },
    
    deleteToken: (tokenValue, interviewId) => {
      if (!interviewId) {
        interviewId = localStorage.getItem('activeInterviewId') || 1;
      }
      return api.delete(`/interviewer/interviews/${interviewId}/tokens/${tokenValue}`);
    }
  };

// Configuration API
export const configAPI = USE_MOCKS ? mockConfigAPI : {
  getConfig: () => api.get('/interviewer/config'),
  updateConfig: (configData) => api.put('/interviewer/config', configData),
};

// Candidate interview session
export const candidateAPI = {
  startInterview: (token) => api.post('/candidates/interview/start', { token }),
  submitAnswer: (interviewId, answerData) => api.post(`/candidates/interview/${interviewId}/answer`, answerData),
  completeInterview: (interviewId) => api.post(`/candidates/interview/${interviewId}/complete`),
  saveRecording: (recordingData) => {
    const { interviewId, questionId, recordingBlob, duration } = recordingData;
    
    const formData = new FormData();
    formData.append('video', recordingBlob, `question_${questionId}.webm`);
    formData.append('questionId', questionId);
    formData.append('duration', duration);
    
    return api.post(`/candidates/interview/${interviewId}/recording`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
};

export default api;
