// src/services/interviewService.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8000/api/v1'
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
    return api.get('/interviewer/interviews');
  },

  getInterview: (id) => {
    return api.get(`/interviewer/interviews/${id}`);
  },

  createInterview: (interviewData) => {
    return api.post('/interviewer/interviews', interviewData);
  },

  updateInterview: (id, interviewData) => {
    return api.put(`/interviewer/interviews/${id}`, interviewData);
  },
  
  updateInterviewWithQuestions: (id, completeData) => {
    return api.put(`/interviewer/interviews/${id}/update`, completeData);
  },

  deleteInterview: (id) => {
    return api.delete(`/interviewer/interviews/${id}`);
  },

  // Question management - consolidated under unified endpoint
  getQuestions: (interviewId) => {
    return api.get(`/interviewer/interviews/${interviewId}/questions`);
  },

  getQuestionsByInterview: (interviewId) => {
    return api.get(`/interviewer/interviews/${interviewId}/questions`);
  },

  addQuestion: (questionData) => {
    const { interviewId, ...data } = questionData;
    return api.post(`/interviewer/${interviewId}/edit`, {
      action: "add",
      question_data: data
    });
  },

  updateQuestion: (interviewId, questionId, questionData) => {
    return api.post(`/interviewer/${interviewId}/edit`, {
      action: "update",
      question_id: questionId,
      question_data: questionData
    });
  },

  deleteQuestion: (interviewId, questionId) => {
    return api.post(`/interviewer/${interviewId}/edit`, {
      action: "delete",
      question_id: questionId
    });
  },

  reorderQuestions: (interviewId, orderUpdates) => {
    return api.post(`/interviewer/${interviewId}/edit`, {
      action: "reorder",
      order_updates: orderUpdates
    });
  },

  // Token management
  getTokensByInterview: (interviewId) => {
    return api.get(`/interviewer/interviews/${interviewId}/tokens`);
  },

  generateToken: (interviewId) => {
    return api.post(`/interviewer/interviews/${interviewId}/tokens`);
  },

  generateBulkTokens: (interviewId, count) => {
    return api.post(`/interviewer/interviews/${interviewId}/tokens/bulk`, { count });
  },

  deleteToken: (interviewId, tokenValue) => {
    return api.delete(`/interviewer/interviews/${interviewId}/tokens/${tokenValue}`);
  },

  validateAccessToken: (token) => {
    return api.post('/candidates/tokens/verify', { token });
  },
  
  // Result management
  getInterviewResults: (interviewId) => {
    return api.get(`/interviewer/interviews/${interviewId}/results`);
  },

  getResultDetail: (resultId) => {
    return api.get(`/interviewer/results/${resultId}`);
  },

  deleteResult: (interviewId, sessionId) => {
    return api.delete(`/interviewer/interviews/${interviewId}/results/${sessionId}`);
  },

  updateResultStatus: (resultId, statusData) => {
    return api.patch(`/interviewer/results/${resultId}/status`, statusData);
  },

  // Candidate interview session
  startInterview: (token) => {
    return api.post('/candidates/sessions', { token });
  },

  submitAnswer: (interviewId, answerData) => {
    return api.post(`/candidates/interview/${interviewId}/answer`, answerData);
  },

  completeInterview: (sessionId) => {
    return api.patch(`/candidates/sessions/${sessionId}/complete`);
  },

  saveRecording: (recordingData) => {
    const { sessionId, questionId, recordingBlob } = recordingData;
    
    const formData = new FormData();
    formData.append('audio_file', recordingBlob, `question_${questionId}.webm`);
    formData.append('session_id', sessionId);
    formData.append('question_id', questionId);
    
    return api.post('/candidates/recordings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default interviewAPI;
