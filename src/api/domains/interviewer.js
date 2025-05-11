import api from '../axios-config';

/**
 * Interviewer API Service
 * Organized to match backend endpoint structure with clear relationships between:
 * - Interviews (parent resources)
 * - Questions (attributes of interviews)
 * - Tokens (linked to interviews)
 * - Results (generated from interviews)
 */
const interviewerAPI = {
  // ==================== Profile Management ====================

  /**
   * Get interviewer profile
   * @returns {Promise} - Promise with profile data
   */
  getProfile: () => api.get('/interviewer/profile'),

  /**
   * Update interviewer profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Promise with updated profile
   */
  updateProfile: (profileData) => api.put('/interviewer/profile', profileData),

  // ==================== Interview Management ====================
  
  /**
   * Get all interviews for the interviewer
   * @returns {Promise} - Promise with interview list
   */
  getAllInterviews: () => api.get('/interviewer/interviews'),

  /**
   * Get a specific interview by id
   * @param {string|number} id - Interview ID
   * @returns {Promise} - Promise with interview data
   */
  getInterview: (id) => api.get(`/interviewer/interviews/${id}`),

  /**
   * Create a new interview
   * @param {Object} interviewData - New interview data
   * @returns {Promise} - Promise with created interview
   */
  createInterview: (interviewData) => api.post('/interviewer/interviews', interviewData),

  /**
   * Update an interview
   * @param {string|number} id - Interview ID
   * @param {Object} interviewData - Updated interview data
   * @returns {Promise} - Promise with updated interview
   */
  updateInterview: (id, interviewData) => api.put(`/interviewer/interviews/${id}`, interviewData),
  
  /**
   * Update an interview with questions in a single call
   * @param {string|number} id - Interview ID
   * @param {Object} completeData - Complete interview data with questions
   * @returns {Promise} - Promise with updated interview
   */
  updateInterviewWithQuestions: (id, completeData) => api.put(`/interviewer/interviews/${id}/update`, completeData),

  /**
   * Delete an interview
   * @param {string|number} id - Interview ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteInterview: (id) => api.delete(`/interviewer/interviews/${id}`),

  // ==================== Question Management ====================
  
  /**
   * Get questions for an interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with questions data
   */
  getQuestions: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/questions`),
  
  /**
   * Get questions by interview (alias for getQuestions for backward compatibility)
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with questions data
   */
  getQuestionsByInterview: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/questions`),

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
  getAllQuestionsFromBank: () => api.get('/interviewer/questions'),
  
  /**
   * Add a question to the question bank
   * @param {Object} questionData - Question data
   * @returns {Promise} - Promise with created question
   */
  addQuestionToBank: (questionData) => api.post('/interviewer/questions', questionData),
  
  /**
   * Update a question in the question bank
   * @param {string|number} questionId - Question ID
   * @param {Object} questionData - Updated question data
   * @returns {Promise} - Promise with updated question
   */
  updateQuestionInBank: (questionId, questionData) => api.put(`/interviewer/questions/${questionId}`, questionData),
  
  /**
   * Delete a question from the question bank
   * @param {string|number} questionId - Question ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteQuestionFromBank: (questionId) => api.delete(`/interviewer/questions/${questionId}`),
  
  // ==================== Token Management ====================

  /**
   * Get all tokens for an interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with tokens data
   */
  getTokensByInterview: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/tokens`),
  
  /**
   * Get tokens (alias for getTokensByInterview for backward compatibility)
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with tokens data
   */
  getTokens: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/tokens`),

  /**
   * Generate a single access token for an interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with generated token
   */
  generateToken: (interviewId) => api.post(`/interviewer/interviews/${interviewId}/tokens`),

  /**
   * Generate multiple access tokens for an interview
   * @param {string|number} interviewId - Interview ID
   * @param {number} count - Number of tokens to generate
   * @returns {Promise} - Promise with generated tokens
   */
  generateBulkTokens: (interviewId, count = 5) => api.post(`/interviewer/interviews/${interviewId}/tokens/bulk`, { count }),
  
  /**
   * Legacy endpoint for generating tokens from backend
   * @param {string|number} interviewId - Interview ID
   * @param {number} count - Number of tokens to generate
   * @returns {Promise} - Promise with generated tokens
   */
  backendGenerateTokens: (interviewId, count = 1) => api.post(`/interviewer/interviews/${interviewId}/generate-tokens`, { count }),

  /**
   * Delete an access token
   * @param {string|number} tokenValue - Token value to delete
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteToken: (tokenValue, interviewId) => api.delete(`/interviewer/interviews/${interviewId}/tokens/${tokenValue}`),
  
  // ==================== Result Management ====================
  
  /**
   * Get all results across all interviews
   * @returns {Promise} - Promise with all results
   */
  getAllResults: () => api.get('/interviewer/results'),
  
  /**
   * Get results for a specific interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with interview results
   */
  getInterviewResults: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/results`),

  /**
   * Get detailed information for a specific result
   * @param {string|number} resultId - Result ID
   * @returns {Promise} - Promise with detailed result data
   */
  getResultDetail: (resultId) => api.get(`/interviewer/results/${resultId}`),

  /**
   * Delete a result from an interview
   * @param {string|number} interviewId - Interview ID
   * @param {string|number} sessionId - Session/result ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteResult: (interviewId, sessionId) => api.delete(`/interviewer/interviews/${interviewId}/results/${sessionId}`),

  /**
   * Update a result's status (reviewed, approved, etc)
   * @param {string|number} resultId - Result ID
   * @param {Object} statusData - Status data to update
   * @returns {Promise} - Promise with updated result
   */
  updateResultStatus: (resultId, statusData) => api.patch(`/interviewer/results/${resultId}/status`, statusData),
  
  // ==================== Analytics ====================
  
  /**
   * Get analytics data
   * @param {Object} params - Optional query parameters
   * @returns {Promise} - Promise with analytics data
   */
  getAnalytics: (params = {}) => api.get('/interviewer/analytics', { params }),
  
  /**
   * Get analytics for a specific interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with interview analytics
   */
  getInterviewAnalytics: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/analytics`),
  
  // ==================== Theme Management ====================

  /**
   * Get the theme settings for an interview
   * @param {string|number} interviewId - Interview ID
   * @returns {Promise} - Promise with theme data
   */
  getInterviewTheme: (interviewId) => api.get(`/interviewer/interviews/${interviewId}/theme`),
  
  /**
   * Update the theme settings for an interview
   * @param {string|number} interviewId - Interview ID
   * @param {Object} themeData - Theme settings data
   * @returns {Promise} - Promise with updated theme data
   */
  updateInterviewTheme: (interviewId, themeData) => api.put(`/interviewer/interviews/${interviewId}/theme`, themeData),
  /**
   * Get the global theme settings for the current interviewer
   * @returns {Promise} - Promise with theme data
   */
  getUserTheme: () => api.get(`/interviewer/theme`),
  
  /**
   * Update the global theme settings for the current interviewer
   * @param {Object} themeData - Theme settings data
   * @returns {Promise} - Promise with updated theme data
   */
  updateUserTheme: (themeData) => api.put(`/interviewer/theme`, themeData)
};

export default interviewerAPI;