import api from './axios-config';

// Token API endpoints that exactly match the backend routes
const tokenAPI = {
  // GET /api/interviewer/interviews/{interview_id}/tokens
  getTokensByInterview: (interviewId) => 
    api.get(`/interviewer/interviews/${interviewId}/tokens`),
  
  // POST /api/interviewer/interviews/{interview_id}/tokens
  generateToken: (interviewId) => 
    api.post(`/interviewer/interviews/${interviewId}/tokens`),
  
  // POST /api/interviewer/interviews/{interview_id}/tokens/bulk
  generateBulkTokens: (interviewId, count = 5) => 
    api.post(`/interviewer/interviews/${interviewId}/tokens/bulk`, { count }),
  
  // POST /api/interviewer/interviews/{interview_id}/generate-tokens
  backendGenerateTokens: (interviewId, count = 1) => 
    api.post(`/interviewer/interviews/${interviewId}/generate-tokens`, { count }),
  
  // DELETE /api/interviewer/interviews/{interview_id}/tokens/{token_value}
  deleteToken: (tokenValue, interviewId) => 
    api.delete(`/interviewer/interviews/${interviewId}/tokens/${tokenValue}`),
  
  // Helper method that uses the correct interview ID
  getTokens: (interviewId = 1) => 
    api.get(`/interviewer/interviews/${interviewId}/tokens`),
};

export default tokenAPI;