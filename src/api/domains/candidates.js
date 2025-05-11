import api from '../axios-config';

/**
 * Candidate API Service
 * Handles all candidate interview session functionality including
 * token verification, interview sessions, answers, and recordings
 */
const candidatesAPI = {
  /**
   * Starts an interview session with a valid token
   * @param {string|Object} data - Token string or object with token property
   * @returns {Promise} Promise with the created session information
   */
  startInterview: (data) => {
    // Create a clean payload with ONLY the token field
    // Extract token value, ensuring it's a string
    const tokenValue = typeof data === 'string' ? data : 
                      (data && typeof data === 'object' && 'token' in data ? data.token : '');
    
    // Create a clean payload that exactly matches backend expectations
    const payload = { token: String(tokenValue) };
    
    console.log('Token value being sent to /sessions:', tokenValue);
    console.log('Exact payload being sent:', JSON.stringify(payload));
    
    return api.post('/candidates/sessions', payload);
  },
  
  /**
   * Submits an answer for a specific question in an interview
   * @param {string|number} interviewId - ID of the active interview session
   * @param {Object} answerData - Answer data to submit
   * @returns {Promise} Promise with the submitted answer data
   */
  submitAnswer: (interviewId, answerData) => api.post(`/candidates/interview/${interviewId}/answer`, answerData),
  
  /**
   * Marks an interview session as complete
   * @param {string|number} sessionId - ID of the session to complete
   * @returns {Promise} Promise with completion confirmation
   */
  completeInterview: (sessionId) => api.patch(`/candidates/sessions/${sessionId}/complete`),
  
  /**
   * Uploads and saves a question recording
   * @param {Object} recordingData - Recording data
   * @param {string|number} recordingData.sessionId - ID of the active session
   * @param {string|number} recordingData.questionId - ID of the question being answered
   * @param {File} recordingData.audioFile - Audio recording file object
   * @returns {Promise} Promise with the saved recording data
   */
  saveRecording: (recordingData) => {
    const { sessionId, questionId, audioFile } = recordingData;
    
    const formData = new FormData();
    formData.append('audio_file', audioFile, `question_${questionId}.webm`);
    formData.append('session_id', sessionId);
    formData.append('question_id', questionId);
    
    return api.post('/candidates/recordings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * Verifies if a token is valid
   * @param {string} token - Token to verify
   * @returns {Promise} Promise with token verification result
   */
  verifyToken: (token) => api.post('/candidates/tokens/verify', { token }),
  
  /**
   * Gets interview details using a token
   * @param {string} token - Interview access token
   * @returns {Promise} Promise with interview details including questions and theme
   */
  getInterviewByToken: (token) => {
    return api.post(`/candidates/tokens/${token}`)
      .then(interviewData => {
        console.log('Interview data received:', interviewData);
        return interviewData;
      });
  }
};

export default candidatesAPI;