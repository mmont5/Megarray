import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { PERMISSIONS, PermissionName } from '../../../lib/permissions';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface Role {
  id: string;
  name: string;
  permissions: PermissionName[];
}

const ManagePermissions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionName[]>([]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      const [userResponse, rolesResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single(),
        supabase
          .from('user_roles')
          .select('*')
      ]);

      if (userResponse.error) throw userResponse.error;
      if (rolesResponse.error) throw rolesResponse.error;

      setUser(userResponse.data);
      setRoles(rolesResponse.data);

      // Get user's current role permissions
      const userRole = rolesResponse.data.find(r => r.name === userResponse.data.role);
      if (userRole) {
        setSelectedPermissions(userRole.permissions);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permission: PermissionName) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      // Update user's role permissions
      const { error } = await supabase
        .from('user_roles')
        .update({ permissions: selectedPermissions })
        .eq('name', user.role);

      if (error) throw error;

      toast.success('Permissions updated successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E5BE]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white">User not found</h2>
        <button
          onClick={() => navigate('/admin/users')}
          className="mt-4 text-[#00E5BE] hover:text-[#00D1AD]"
        >
          Back to Users
        </button>
      </div>
    );
  }

  // Group permissions by category
  const permissionsByCategory = Object.entries(PERMISSIONS).reduce((acc, [key, permission]) => {
    const category = permission.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ key: key as PermissionName, ...permission });
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-white">Manage Permissions</h2>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#00E5BE]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{user.full_name}</h3>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(permissionsByCategory).map(([category, permissions]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-lg font-medium text-white capitalize">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissions.map((permission) => (
                  <div
                    key={permission.key}
                    className={`p-4 rounded-lg border-2 ${
                      selectedPermissions.includes(permission.key)
                        ? 'border-[#00E5BE] bg-[#00E5BE]/10'
                        : 'border-gray-700 hover:border-[#00E5BE]'
                    } transition-colors duration-300 cursor-pointer`}
                    onClick={() => handlePermissionToggle(permission.key)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white font-medium">{permission.name}</h5>
                        <p className="text-sm text-gray-400 mt-1">{permission.description}</p>
                      </div>
                      {selectedPermissions.includes(permission.key) && (
                        <Check className="w-5 h-5 text-[#00E5BE]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h5 className="text-white font-medium">Permission Changes</h5>
            <p className="mt-1 text-sm text-gray-400">
              Changes to permissions will take effect immediately. The user may need to log out and back in
              for some changes to be applied.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePermissions;