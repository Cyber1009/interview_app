/**
 * Protected Route Component
 * Manages:
 * - Route access control
 * - Permission validation
 * - Redirect handling
 * - Authentication state checks
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import CameraPermissions from './CameraPermissions';

const ProtectedRoute = ({ children }) => {
  const hasPermissions = sessionStorage.getItem('cameraPermissionsGranted') === 'true';
  
  if (!hasPermissions) {
    return <CameraPermissions 
      onPermissionsGranted={() => {
        sessionStorage.setItem('cameraPermissionsGranted', 'true');
      }}
    />;
  }

  return children;
};

export default ProtectedRoute;
