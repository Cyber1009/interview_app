import React from 'react';
import RequireAuth from './RequireAuth';

/**
 * RequireAdminAuth Component
 * 
 * A specialized version of RequireAuth that specifically requires admin role.
 * This is a simple wrapper that pre-configures RequireAuth with admin settings.
 */
const RequireAdminAuth = ({ children }) => {
  return (
    <RequireAuth 
      requiredRole="admin" 
      redirectPath="/admin/login"
    >
      {children}
    </RequireAuth>
  );
};

export default RequireAdminAuth;