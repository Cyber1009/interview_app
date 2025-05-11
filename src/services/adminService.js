import axios from 'axios';
import { API_BASE_URL } from '../config';

/**
 * Admin Service
 * Provides access to admin-specific backend endpoints, focusing only on supported features
 */
const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8000/api/v1'
});

// Add auth token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AdminService = {
  // Authentication
  login: (credentials) => {
    return api.post('/admin/auth/login', credentials, {
      // Using multipart form data format for OAuth2 password flow
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    return Promise.resolve();
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
  
  changePassword: (passwordData) => {
    return api.post('/admin/auth/change-password', passwordData);
  },
  
  // User Management
  getAllUsers: (params = {}) => {
    // Transform params into query string format
    // Support for filters, search, pagination, etc.
    return api.get('/admin/users', { params });
  },
  
  getUser: (userId) => {
    return api.get(`/admin/users/${userId}`);
  },
  
  createUser: (userData) => {
    return api.post('/admin/users', userData);
  },
  
  updateUser: (userId, userData) => {
    return api.put(`/admin/users/${userId}`, userData);
  },
  
  deleteUser: (userId) => {
    return api.delete(`/admin/users/${userId}`);
  },
  
  // Pending Accounts
  getPendingAccounts: () => {
    return api.get('/admin/users/pending');
  },
  
  activatePendingAccount: (accountId, activationData) => {
    return api.post(`/admin/users/pending/${accountId}/activate`, activationData);
  },
  
  deletePendingAccount: (accountId) => {
    return api.delete(`/admin/users/pending/${accountId}`);
  },
  
  // System Status & Utilities
  getSystemStatus: () => {
    return api.get('/admin/system/status');
  },
  
  getSystemSettings: () => {
    return api.get('/admin/system/settings');
  },
  
  updateSystemSettings: (settingsData) => {
    return api.put('/admin/system/settings', settingsData);
  },
  
  fixInvalidQuestions: (data) => {
    return api.post('/admin/system/fix-invalid-questions', data);
  }
};

export default AdminService;
