import api from './axios-config';

// Candidate interview session API
const candidateAPI = {
  startInterview: (token) => api.post('/interview/start', { token }),
  submitAnswer: (interviewId, answerData) => api.post(`/interview/${interviewId}/answer`, answerData),
  completeInterview: (interviewId) => api.post(`/interview/${interviewId}/complete`),
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
  },
};

export default candidateAPI;