import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../services';

/**
 * RequireAuth Component
 * Provides:
 * - Authentication protection for routes
 * - Role-based access control
 * - Redirection for unauthorized users
 * - Preservation of attempted navigation location
 */
const RequireAuth = ({ children, requiredRole = 'admin' }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    checked: false,
    authenticated: false,
    authorized: false
  });
  
  useEffect(() => {
    const checkAuth = () => {
      // Get authentication token
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
        if (location.pathname.includes('/admin')) {
          userRole = 'admin';
          localStorage.setItem('userRole', userRole);
        } else if (location.pathname.includes('/interviewer')) {
          userRole = 'interviewer';
          localStorage.setItem('userRole', userRole);
        }
      }
      
      console.log('RequireAuth - Auth Check');
      console.log('- Path:', location.pathname);
      console.log('- Required Role:', requiredRole);
      console.log('- User Role:', userRole);
      
      // Determine authorization based on role and required role
      let isAuthorized = false;
      
      // Special case: admin can access everything
      if (userRole === 'admin') {
        isAuthorized = true;
      }
      // Regular case: match role to required role
      else if (requiredRole === userRole) {
        isAuthorized = true;
      }
      
      console.log('- Is Authorized:', isAuthorized);
      
      // Override: Always authorize if we just logged in
      const freshLogin = sessionStorage.getItem('freshLogin') === 'true';
      if (freshLogin && !isAuthorized) {
        console.log('- Fresh login detected, overriding authorization');
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
    console.log('Not authenticated, redirecting to login');
    // Redirect to login based on required role
    const loginPath = requiredRole === 'admin' ? '/admin/login' : '/interviewer/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  
  // Handle not authorized
  if (!authState.authorized) {
    console.warn('Not authorized to access this resource');
    return <Navigate to="/unauthorized" replace />;
  }
  
  // All good, render the protected component
  return children;
};

export default RequireAuth;
