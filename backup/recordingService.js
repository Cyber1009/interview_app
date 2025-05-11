/**
 * Recording Service
 * Handles:
 * - Video/audio recording uploads
 * - Transcription requests
 * - Analysis and scoring
 * - Recording retrieval and management
 */

import api from './api';
import { ErrorService } from './index';

class RecordingService {
  /**
   * Upload a recording to the server
   * @param {Object} recordingData - Recording data including session_id, question_id, audio_data
   * @returns {Promise} - Promise with recording info
   */
  async uploadRecording(recordingData) {
    try {
      const response = await api.post('/recordings', recordingData);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to upload recording', error);
      throw error;
    }
  }

  /**
   * Get recording by ID
   * @param {number} recordingId - The recording ID
   * @returns {Promise} - Promise with recording data
   */
  async getRecording(recordingId) {
    try {
      const response = await api.get(`/recordings/${recordingId}`);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch recording', error);
      throw error;
    }
  }

  /**
   * Get transcript for a recording
   * @param {number} recordingId - The recording ID
   * @returns {Promise} - Promise with transcript data
   */
  async getTranscript(recordingId) {
    try {
      const response = await api.get(`/recordings/${recordingId}/transcript`);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch transcript', error);
      throw error;
    }
  }

  /**
   * Get analysis for a recording
   * @param {number} recordingId - The recording ID
   * @returns {Promise} - Promise with analysis data
   */
  async getAnalysis(recordingId) {
    try {
      const response = await api.get(`/recordings/${recordingId}/analysis`);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch analysis', error);
      throw error;
    }
  }
  
  /**
   * Get all recordings for a session
   * @param {number} sessionId - The session ID
   * @returns {Promise} - Promise with recordings list
   */
  async getSessionRecordings(sessionId) {
    try {
      const response = await api.get(`/sessions/${sessionId}/recordings`);
      return response.data;
    } catch (error) {
      ErrorService.handleError('Failed to fetch session recordings', error);
      throw error;
    }
  }
}

export default new RecordingService();