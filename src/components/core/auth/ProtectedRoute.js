/**
 * Protected Route Component
 * 
 * Implements route protection based on authentication status.
 * Redirects unauthenticated users to a specified login page.
 * 
 * Features:
 * - Authentication status checking
 * - Configurable redirect paths
 * - Compatible with React Router v6
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ 
  children, 
  isAuthenticated, 
  redirectPath = "/login",
  role = null // Optional role requirement
}) => {
  // Check authentication first
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // If role is specified, check the user's role (could be extended to use stored role)
  if (role && localStorage.getItem('userRole') !== role) {
    // Redirect to appropriate login based on required role
    if (role === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/interviewer/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;