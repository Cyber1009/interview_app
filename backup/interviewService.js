// src/services/interviewService.js
import api from './api';

/**
 * Interview API Service
 * Organized to match backend endpoint structure with clear relationships between:
 * - Interviews (parent resources)
 * - Questions (attributes of interviews)
 * - Tokens (linked to interviews)
 * - Results (generated from interviews)
 */
const interviewAPI = {
  // ==================== Interview Management ====================
  
  /**
   * Get all interviews for the interviewer
   * @returns {Promise} - Promise with interview list
   */
  getAllInterviews: () => {
    return api.get('/interviewer/interviews');
  },

  /**
   * Get a specific interview by id
   * @param {string|number} id - Interview ID
   * @returns {Promise} - Promise with interview data
   */
  getInterview: (id) => {
    return api.get(`/interviewer/interviews/${id}`);
  },

  /**
   * Create a new interview
   * @param {Object} interviewData - New interview data
   * @returns {Promise} - Promise with created interview
   */
  createInterview: (interviewData) => {
    return api.post('/interviewer/interviews', interviewData);
  },

  /**
   * Update an interview
   * @param {string|number} id - Interview ID
   * @param {Object} interviewData - Updated interview data
   * @returns {Promise} - Promise with updated interview
   */
  updateInterview: (id, interviewData) => {
    return api.put(`/interviewer/interviews/${id}`, interviewData);
  },
  
  /**
   * Update an interview with questions in a single call
   * @param {string|number} id - Interview ID
   * @param {Object} completeData - Complete interview data with questions
   * @returns {Promise} - Promise with updated interview
   */
  updateInterviewWithQuestions: (id, completeData) => {
    return api.put(`/interviewer/interviews/${id}/update`, completeData);
  },

  /**
   * Delete an interview
   * @param {string|number} id - Interview ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteInterview: (id) => {
    return api.delete(`/interviewer/interviews/${id}`);
  },

  // ==================== Question Management ====================
  
  /**
   * Get questions for an interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with questions data
   */
  getQuestions: (interviewId) => {
    return api.get(`/interviewer/interviews/${interviewId}/questions`);
  },

  /**
   * Add a question to an interview
   * @param {Object} questionData - Question data with interviewId
   * @returns {Promise} - Promise with created question
   */
  addQuestion: (questionData) => {
    const { interviewId, ...data } = questionData;
    return api.post(`/interviewer/interviews/${interviewId}/edit`, {
      action: "add",
      question_data: data
    });
  },

  /**
   * Update a question in an interview
   * @param {string|number} interviewId - Interview ID
   * @param {string|number} questionId - Question ID
   * @param {Object} questionData - Updated question data
   * @returns {Promise} - Promise with updated question
   */
  updateQuestion: (interviewId, questionId, questionData) => {
    return api.post(`/interviewer/interviews/${interviewId}/edit`, {
      action: "update",
      question_id: questionId,
      question_data: questionData
    });
  },

  /**
   * Delete a question from an interview
   * @param {string|number} interviewId - Interview ID
   * @param {string|number} questionId - Question ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteQuestion: (interviewId, questionId) => {
    return api.post(`/interviewer/interviews/${interviewId}/edit`, {
      action: "delete",
      question_id: questionId
    });
  },

  /**
   * Reorder questions in an interview
   * @param {string|number} interviewId - Interview ID
   * @param {Array} orderUpdates - Array of question order updates
   * @returns {Promise} - Promise with reordered questions
   */
  reorderQuestions: (interviewId, orderUpdates) => {
    return api.post(`/interviewer/interviews/${interviewId}/edit`, {
      action: "reorder",
      order_updates: orderUpdates
    });
  },
  
  // ==================== Question Bank Management ====================
  
  /**
   * Get all questions from the question bank
   * @returns {Promise} - Promise with all available questions
   */
  getAllQuestionsFromBank: () => {
    return api.get('/interviewer/questions');
  },
  
  /**
   * Add a question to the question bank
   * @param {Object} questionData - Question data
   * @returns {Promise} - Promise with created question
   */
  addQuestionToBank: (questionData) => {
    return api.post('/interviewer/questions', questionData);
  },
  
  /**
   * Update a question in the question bank
   * @param {string|number} questionId - Question ID
   * @param {Object} questionData - Updated question data
   * @returns {Promise} - Promise with updated question
   */
  updateQuestionInBank: (questionId, questionData) => {
    return api.put(`/interviewer/questions/${questionId}`, questionData);
  },
  
  /**
   * Delete a question from the question bank
   * @param {string|number} questionId - Question ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteQuestionFromBank: (questionId) => {
    return api.delete(`/interviewer/questions/${questionId}`);
  },
  
  // ==================== Token Management ====================

  /**
   * Get all tokens for an interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with tokens data
   */
  getTokensByInterview: (interviewId) => {
    return api.get(`/interviewer/interviews/${interviewId}/tokens`);
  },

  /**
   * Generate a single access token for an interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with generated token
   */
  generateToken: (interviewId) => {
    return api.post(`/interviewer/interviews/${interviewId}/tokens`);
  },

  /**
   * Generate multiple access tokens for an interview
   * @param {string|number} interviewId - Interview ID
   * @param {number} count - Number of tokens to generate
   * @returns {Promise} - Promise with generated tokens
   */
  generateBulkTokens: (interviewId, count) => {
    return api.post(`/interviewer/interviews/${interviewId}/tokens/bulk`, { count });
  },

  /**
   * Delete an access token
   * @param {string|number} interviewId - Interview ID
   * @param {string} tokenValue - Token value to delete
   * @returns {Promise} - Promise with deletion result
   */
  deleteToken: (interviewId, tokenValue) => {
    return api.delete(`/interviewer/interviews/${interviewId}/tokens/${tokenValue}`);
  },

  /**
   * Validate an access token
   * @param {string} token - Token to validate
   * @returns {Promise} - Promise with validation result
   */
  validateAccessToken: (token) => {
    return api.post('/candidates/tokens/verify', { token });
  },
  
  // ==================== Result Management ====================
  
  /**
   * Get all results across all interviews
   * @returns {Promise} - Promise with all results
   */
  getAllResults: () => {
    return api.get('/interviewer/results');
  },
  
  /**
   * Get results for a specific interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with interview results
   */
  getInterviewResults: (interviewId) => {
    return api.get(`/interviewer/interviews/${interviewId}/results`);
  },

  /**
   * Get detailed information for a specific result
   * @param {string|number} resultId - Result ID
   * @returns {Promise} - Promise with detailed result data
   */
  getResultDetail: (resultId) => {
    return api.get(`/interviewer/results/${resultId}`);
  },

  /**
   * Delete a result from an interview
   * @param {string|number} interviewId - Interview ID
   * @param {string|number} sessionId - Session/result ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteResult: (interviewId, sessionId) => {
    return api.delete(`/interviewer/interviews/${interviewId}/results/${sessionId}`);
  },

  /**
   * Update a result's status (reviewed, approved, etc)
   * @param {string|number} resultId - Result ID
   * @param {Object} statusData - Status data to update
   * @returns {Promise} - Promise with updated result
   */
  updateResultStatus: (resultId, statusData) => {
    return api.patch(`/interviewer/results/${resultId}/status`, statusData);
  },
  
  // ==================== Analytics ====================
  
  /**
   * Get analytics data
   * @param {Object} params - Optional query parameters
   * @returns {Promise} - Promise with analytics data
   */
  getAnalytics: (params = {}) => {
    return api.get('/interviewer/analytics', { params });
  },
  
  /**
   * Get analytics for a specific interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with interview analytics
   */
  getInterviewAnalytics: (interviewId) => {
    return api.get(`/interviewer/interviews/${interviewId}/analytics`);
  },
  
  // ==================== Candidate Interview Session ====================

  /**
   * Start an interview session for a candidate
   * @param {string} token - Access token
   * @returns {Promise} - Promise with session data
   */
  startInterview: (token) => {
    // Handle both string token and object with token property
    const tokenValue = typeof token === 'string' ? token : token.token;
    return api.post('/candidates/sessions', { token: tokenValue });
  },

  /**
   * Submit an answer for a question
   * @param {string|number} sessionId - Session ID
   * @param {Object} answerData - Answer data
   * @returns {Promise} - Promise with submission result
   */
  submitAnswer: (sessionId, answerData) => {
    return api.post(`/candidates/sessions/${sessionId}/answers`, answerData);
  },

  /**
   * Complete an interview session
   * @param {string|number} sessionId - Session ID
   * @returns {Promise} - Promise with completion result
   */
  completeInterview: (sessionId) => {
    return api.post(`/candidates/sessions/${sessionId}/complete`);
  },

  /**
   * Save a video recording
   * @param {Object} recordingData - Recording data with session and question IDs
   * @returns {Promise} - Promise with saved recording data
   */
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
  },

  /**
   * Get the theme settings for an interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with theme data
   */
  getInterviewTheme: (interviewId) => {
    return api.get(`/interviewer/interviews/${interviewId}/theme`);
  },
  
  /**
   * Update the theme settings for an interview
   * @param {string|number} interviewId - Interview ID
   * @param {Object} themeData - Theme settings data
   * @returns {Promise} - Promise with updated theme data
   */
  updateInterviewTheme: (interviewId, themeData) => {
    return api.put(`/interviewer/interviews/${interviewId}/theme`, themeData);
  }
};

export default interviewAPI;

