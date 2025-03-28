import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionName, hasPermission, hasAnyPermission, hasAllPermissions } from '../lib/permissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions: PermissionName | PermissionName[];
  mode?: 'any' | 'all';
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions,
  mode = 'any',
  fallback = null,
}) => {
  const { permissions: userPermissions, loading } = usePermissions();

  if (loading) {
    return null;
  }

  const hasAccess = Array.isArray(permissions)
    ? mode === 'any'
      ? hasAnyPermission(userPermissions, permissions)
      : hasAllPermissions(userPermissions, permissions)
    : hasPermission(userPermissions, permissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;