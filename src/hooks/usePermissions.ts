import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PermissionName } from '../lib/permissions';

export function usePermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<PermissionName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      if (!user) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        // For development with mock user, return all permissions
        if (user.id === '00000000-0000-0000-0000-000000000000') {
          setPermissions([
            'create_content',
            'edit_own_content',
            'delete_own_content',
            'view_analytics',
            'manage_team_roles',
            'invite_team_members',
            'view_team_analytics',
            'manage_client_accounts',
            'white_label_reports',
            'api_access'
          ] as PermissionName[]);
          setLoading(false);
          return;
        }

        // In production, this would fetch actual permissions
        setPermissions([]);
      } catch (error) {
        console.error('Error loading permissions:', error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [user]);

  return { permissions, loading };
}