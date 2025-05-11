import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../../services';
import AdminAuthService from '../../../services/adminAuthService';

/**
 * RequireAuth Component
 * 
 * Enhanced authentication protection component that combines
 * features from both ProtectedRoute and RequireAuth.
 * 
 * Features:
 * - Role-based access control
 * - Authentication status checking
 * - URL-based role detection
 * - Detailed logging (in development)
 * - Fresh login detection
 * - Preservation of attempted navigation location
 */
const RequireAuth = ({ 
  children, 
  requiredRole = null,
  redirectPath = null 
}) => {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    checked: false,
    authenticated: false,
    authorized: false
  });
  
  useEffect(() => {
    const checkAuth = () => {
      // Check if this is for admin routes
      const isAdminRoute = requiredRole === 'admin' || location.pathname.includes('/admin');
      
      // For admin routes, use AdminAuthService
      if (isAdminRoute) {
        const isAdminAuthenticated = AdminAuthService.isAuthenticated();
        
        if (process.env.NODE_ENV === 'development') {
          console.log('RequireAuth - Admin Auth Check');
          console.log('- Path:', location.pathname);
          console.log('- Admin Token Present:', isAdminAuthenticated);
        }
        
        // Check for fresh admin login
        const freshAdminLogin = sessionStorage.getItem('freshAdminLogin') === 'true';
        if (freshAdminLogin) {
          if (process.env.NODE_ENV === 'development') {
            console.log('- Fresh admin login detected');
          }
          sessionStorage.removeItem('freshAdminLogin');
        }
        
        setAuthState({
          checked: true,
          authenticated: isAdminAuthenticated,
          authorized: isAdminAuthenticated
        });
        
        return;
      }
      
      // Standard auth flow for non-admin routes
      const token = AuthService.getToken();
      
      // If no token, not authenticated
      if (!token) {
        setAuthState({
          checked: true,
          authenticated: false,
          authorized: false
        });
        return;
      }
      
      // We have a token, so we're authenticated at least
      // Now determine the role for authorization
      let userRole = AuthService.getUserRole();
      
      // If role not found in token/localStorage, determine from URL
      if (!userRole) {
        // Location-based role determination (fallback)
        if (location.pathname.includes('/interviewer')) {
          userRole = 'interviewer';
          localStorage.setItem('userRole', userRole);
        }
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('RequireAuth - Auth Check');
        console.log('- Path:', location.pathname);
        console.log('- Required Role:', requiredRole);
        console.log('- User Role:', userRole);
      }
      
      // Determine authorization based on role and required role
      let isAuthorized = false;
      
      // If no specific role is required, just being authenticated is enough
      if (!requiredRole) {
        isAuthorized = true;
      }
      // Regular case: match role to required role
      else if (requiredRole === userRole) {
        isAuthorized = true;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('- Is Authorized:', isAuthorized);
      }
      
      // Override: Always authorize if we just logged in
      const freshLogin = sessionStorage.getItem('freshLogin') === 'true';
      if (freshLogin && !isAuthorized) {
        if (process.env.NODE_ENV === 'development') {
          console.log('- Fresh login detected, overriding authorization');
        }
        isAuthorized = true;
        sessionStorage.removeItem('freshLogin');
      }
      
      setAuthState({
        checked: true,
        authenticated: true,
        authorized: isAuthorized
      });
    };
    
    checkAuth();
  }, [location.pathname, requiredRole]);
  
  // Wait until we've checked authentication
  if (!authState.checked) {
    return null;
  }
  
  // Handle not authenticated
  if (!authState.authenticated) {
    // Determine redirect path
    let loginPath = redirectPath;
    if (!loginPath) {
      // Default redirect based on required role
      loginPath = requiredRole === 'admin' ? '/admin/login' : '/interviewer/login';
    }
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  
  // Handle not authorized
  if (!authState.authorized) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // All good, render the protected component
  return children;
};

export default RequireAuth;