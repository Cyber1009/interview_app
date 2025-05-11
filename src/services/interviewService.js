// src/services/interviewService.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8000/api'
});

// Add auth token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const interviewAPI = {
  // Interview management
  getAllInterviews: () => {
    return api.get('/interviews');
  },

  getInterview: (id) => {
    return api.get(`/interviews/${id}`);
  },

  createInterview: (interviewData) => {
    return api.post('/interviews', interviewData);
  },

  updateInterview: (id, interviewData) => {
    return api.put(`/interviews/${id}`, interviewData);
  },

  deleteInterview: (id) => {
    return api.delete(`/interviews/${id}`);
  },

  // Question management
  getQuestions: (interviewId) => {
    return api.get(`/interviews/${interviewId}/questions`);
  },

  getQuestionsByInterview: (interviewId) => {
    return api.get(`/interviews/${interviewId}/questions`);
  },

  addQuestion: (questionData) => {
    const { interviewId, ...data } = questionData;
    return api.post(`/interviews/${interviewId}/questions`, data);
  },

  updateQuestion: (id, questionData) => {
    return api.put(`/questions/${id}`, questionData);
  },

  deleteQuestion: (id) => {
    return api.delete(`/questions/${id}`);
  },

  reorderQuestions: (interviewId, questionIds) => {
    return api.post(`/interviews/${interviewId}/questions/reorder`, { questionIds });
  },

  // Token management
  getTokensByInterview: (interviewId) => {
    return api.get(`/interviews/${interviewId}/tokens`);
  },

  generateToken: (interviewId) => {
    return api.post(`/interviews/${interviewId}/tokens`);
  },

  generateBulkTokens: (interviewId, count) => {
    return api.post(`/interviews/${interviewId}/tokens/bulk`, { count });
  },

  deleteToken: (id) => {
    return api.delete(`/tokens/${id}`);
  },

  validateAccessToken: (token) => {
    return api.post('/validate-token', { token });
  },
  
  // Result management
  getInterviewResults: (interviewId) => {
    return api.get(`/interviews/${interviewId}/results`);
  },

  getResultDetail: (resultId) => {
    return api.get(`/results/${resultId}`);
  },

  deleteResult: (resultId) => {
    return api.delete(`/results/${resultId}`);
  },

  updateResultStatus: (resultId, statusData) => {
    return api.patch(`/results/${resultId}/status`, statusData);
  },

  // Candidate interview session
  startInterview: (token) => {
    return api.post('/interview/start', { token });
  },

  submitAnswer: (interviewId, answerData) => {
    return api.post(`/interview/${interviewId}/answer`, answerData);
  },

  completeInterview: (interviewId) => {
    return api.post(`/interview/${interviewId}/complete`);
  },

  saveRecording: (recordingData) => {
    const { interviewId, questionId, recordingBlob, duration } = recordingData;
    
    const formData = new FormData();
    formData.append('video', recordingBlob, `question_${questionId}.webm`);
    formData.append('questionId', questionId);
    formData.append('duration', duration);
    
    return api.post(`/interview/${interviewId}/recording`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default interviewAPI;
