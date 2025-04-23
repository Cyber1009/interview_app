import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      
      // Determine appropriate login page based on current URL
      const currentPath = window.location.pathname;
      if (currentPath.includes('/interviewer')) {
        window.location.href = '/interviewer/login';
      } else if (currentPath.includes('/admin')) {
        window.location.href = '/admin/login';
      } else {
        // Default to interviewer login if path doesn't indicate role
        window.location.href = '/interviewer/login';
      }
    }
    return Promise.reject(error);
  }
);

// Token management API functions
export const tokenAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/tokens');
    return response.data;
  },
  
  generate: async (tokenData) => {
    const response = await apiClient.post('/admin/tokens', tokenData);
    return response.data;
  },
  
  revoke: async (tokenId) => {
    const response = await apiClient.delete(`/admin/tokens/${tokenId}`);
    return response.data;
  },
  
  update: async (tokenId, tokenData) => {
    const response = await apiClient.put(`/admin/tokens/${tokenId}`, tokenData);
    return response.data;
  }
};

// Configuration API functions
export const configAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/config');
    return response.data;
  },
  
  update: async (configData) => {
    const response = await apiClient.put('/admin/config', configData);
    return response.data;
  }
};

// Interview API functions
export const interviewAPI = {
  getResults: async (interviewId) => {
    const response = await apiClient.get(`/admin/interviews/${interviewId}/results`);
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get('/admin/interviews');
    return response.data;
  },
  
  create: async (interviewData) => {
    const response = await apiClient.post('/admin/interviews', interviewData);
    return response.data;
  },
  
  update: async (interviewId, interviewData) => {
    const response = await apiClient.put(`/admin/interviews/${interviewId}`, interviewData);
    return response.data;
  },
  
  delete: async (interviewId) => {
    const response = await apiClient.delete(`/admin/interviews/${interviewId}`);
    return response.data;
  }
};

// Question API functions
export const questionAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/questions');
    return response.data;
  },
  
  create: async (questionData) => {
    const response = await apiClient.post('/admin/questions', questionData);
    return response.data;
  },
  
  update: async (questionId, questionData) => {
    const response = await apiClient.put(`/admin/questions/${questionId}`, questionData);
    return response.data;
  },
  
  delete: async (questionId) => {
    const response = await apiClient.delete(`/admin/questions/${questionId}`);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await apiClient.get('/admin/questions/categories');
    return response.data;
  }
};

export default apiClient;
