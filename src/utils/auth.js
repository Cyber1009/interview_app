// src/utils/auth.js
export const AUTH_CONFIG = {
    TOKEN_KEY: 'authToken',
    ROLE_KEY: 'userRole',
    EXPIRES_KEY: 'expiresAt',
    INTERVIEW_TOKEN: 'interviewToken'
  };

export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REFRESH: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout'
};

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  SESSION_EXPIRED: 'Session expired',
  UNAUTHORIZED: 'Unauthorized access',
  NETWORK_ERROR: 'Network error occurred'
};

export const ROLES = {
  ADMIN: 'admin',
  INTERVIEWER: 'interviewer',
  CANDIDATE: 'candidate'
};
  
  export const setAuth = (token, role, expiresIn = 3600000) => { // default 1 hour
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    localStorage.setItem(AUTH_CONFIG.ROLE_KEY, role);
    localStorage.setItem(AUTH_CONFIG.EXPIRES_KEY, 
      new Date(Date.now() + expiresIn).toISOString()
    );
  };
  
  export const clearAuth = () => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.ROLE_KEY);
    localStorage.removeItem(AUTH_CONFIG.EXPIRES_KEY);
    localStorage.removeItem(AUTH_CONFIG.INTERVIEW_TOKEN);
  };
  
  export const isAuthenticated = () => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    const expiresAt = localStorage.getItem(AUTH_CONFIG.EXPIRES_KEY);
    
    if (!token || !expiresAt) return false;
    return new Date(expiresAt) > new Date();
  };
  
  export const getUserRole = () => {
    return localStorage.getItem(AUTH_CONFIG.ROLE_KEY);
  };