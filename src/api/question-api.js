import api from './axios-config';

// Question API endpoints
const questionAPI = {
  getQuestionsByInterview: (interviewId) => api.get(`/interviews/${interviewId}/questions`),
  addQuestion: (questionData) => {
    const { interviewId, ...data } = questionData;
    return api.post(`/interviews/${interviewId}/questions`, data);
  },
  updateQuestion: (id, questionData) => api.put(`/questions/${id}`, questionData),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
  reorderQuestions: (interviewId, questionIds) => api.post(`/interviews/${interviewId}/questions/reorder`, { questionIds }),
};

export default questionAPI;