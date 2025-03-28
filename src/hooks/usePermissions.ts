import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PermissionName, getUserPermissions } from '../lib/permissions';

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
        const userPermissions = await getUserPermissions(user.id);
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Error loading permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [user]);

  return { permissions, loading };
}