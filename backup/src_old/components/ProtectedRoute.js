import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
//   // Get user role and token from localStorage
//   const userRole = localStorage.getItem('userRole');
//   const token = localStorage.getItem('authToken');
  
//   const isAuthorized = () => {
//     if (!token) return false;
    
//     switch (requiredRole) {
//       case 'admin':
//         return userRole === 'admin';
//       case 'interviewer':
//         return userRole === 'interviewer' || userRole === 'admin';
//       case 'candidate':
//         // Check if candidate has valid interview token
//         const interviewToken = localStorage.getItem('interviewToken');
//         return userRole === 'candidate' && interviewToken;
//       default:
//         return false;
//     }
//   };

//   if (!isAuthorized()) {
//     // Redirect to appropriate login page based on attempted access
//     const redirectPath = requiredRole === 'admin' ? '/admin-login' : 
//                         requiredRole === 'interviewer' ? '/interviewer-login' : '/';
//     return <Navigate to={redirectPath} replace />;
//   }

  return children;
};

export default ProtectedRoute;