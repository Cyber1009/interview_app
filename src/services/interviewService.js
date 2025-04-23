/**
 * Interview Service
 * Handles:
 * - Interview session management
 * - Questions handling
 * - Interview tokens
 * - Results and analysis
 */

import api from './api';
import { ErrorService } from './index';

class InterviewService {
  /**
   * Verify an interview token
   * @param {string} token - The token to verify
   * @returns {Promise} - Promise with token verification result
   */
  async verifyToken(token) {
    try {
      const response = await api.post('/interviews/verify-token', { token });
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to verify token', error);
      throw error;
    }
  }

  /**
   * Start an interview session
   * @param {string} token - The valid interview token
   * @returns {Promise} - Promise with session data
   */
  async startSession(token) {
    try {
      const response = await api.post('/interviews/sessions/start', { token });
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to start session', error);
      throw error;
    }
  }

  /**
   * End an interview session
   * @param {number} sessionId - The session ID to end
   * @returns {Promise} - Promise with session end result
   */
  async endSession(sessionId) {
    try {
      const response = await api.post(`/interviews/sessions/${sessionId}/end`);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to end session', error);
      throw error;
    }
  }

  /**
   * Get interview questions
   * @param {number} interviewId - The interview ID
   * @returns {Promise} - Promise with interview questions
   */
  async getQuestions(interviewId) {
    try {
      const response = await api.get(`/interviews/${interviewId}/questions`);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch questions', error);
      throw error;
    }
  }

  /**
   * Get interview by ID
   * @param {number} interviewId - The interview ID
   * @returns {Promise} - Promise with interview data
   */
  async getInterview(interviewId) {
    try {
      const response = await api.get(`/interviews/${interviewId}`);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch interview', error);
      throw error;
    }
  }
  
  /**
   * Create a new question
   * @param {number} interviewId - The interview ID
   * @param {Object} questionData - Question data
   * @returns {Promise} - Promise with question creation result
   */
  async createQuestion(interviewId, questionData) {
    try {
      const response = await api.post(`/interviews/${interviewId}/questions`, questionData);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to create question', error);
      throw error;
    }
  }
  
  /**
   * Update question order
   * @param {number} interviewId - The interview ID
   * @param {Array} orderUpdates - Array of order updates
   * @returns {Promise} - Promise with order update result
   */
  async updateQuestionOrder(interviewId, orderUpdates) {
    try {
      const response = await api.put(`/interviews/${interviewId}/questions/order`, { updates: orderUpdates });
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to update question order', error);
      throw error;
    }
  }
  
  /**
   * Get interview results
   * @param {number} interviewId - The interview ID
   * @returns {Promise} - Promise with interview results
   */
  async getInterviewResults(interviewId) {
    try {
      const response = await api.get(`/interviews/${interviewId}/results`);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch interview results', error);
      throw error;
    }
  }
}

export default new InterviewService();
