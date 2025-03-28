import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionName } from '../lib/permissions';

interface AuthGuardProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
  allowedRoles?: string[];
  requiredPermissions?: PermissionName[];
  requireAllPermissions?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireSubscription = false,
  allowedRoles = [],
  requiredPermissions = [],
  requireAllPermissions = false,
}) => {
  const { user, loading } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const location = useLocation();

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E5BE]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireSubscription && (!user.subscription || user.subscription.status !== 'active')) {
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAllPermissions
      ? requiredPermissions.every(p => permissions.includes(p))
      : requiredPermissions.some(p => permissions.includes(p));

    if (!hasRequiredPermissions) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;