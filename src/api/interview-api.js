import api from './axios-config';

// Interview API endpoints
const interviewAPI = {
  // Interview management
  getAllInterviews: () => api.get('/interviews'),
  getInterview: (id) => api.get(`/interviews/${id}`),
  createInterview: (interviewData) => api.post('/interviews', interviewData),
  updateInterview: (id, interviewData) => api.put(`/interviews/${id}`, interviewData),
  deleteInterview: (id) => api.delete(`/interviews/${id}`),
  
  // Get interview results
  getInterviewResults: (interviewId) => api.get(`/interviews/${interviewId}/results`),
  getResultDetail: (resultId) => api.get(`/results/${resultId}`),
  deleteResult: (resultId) => api.delete(`/results/${resultId}`),
  updateResultStatus: (resultId, statusData) => api.patch(`/results/${resultId}/status`, statusData),
};

export default interviewAPI;