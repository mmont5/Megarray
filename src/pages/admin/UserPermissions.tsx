import React, { useState, useEffect } from 'react';
import { Users, Shield, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { PERMISSIONS, PermissionName } from '../../lib/permissions';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  permissions: PermissionName[];
}

interface Role {
  id: string;
  name: string;
  permissions: PermissionName[];
}

const UserPermissions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, email, role, name')
          .order('created_at', { ascending: false }),
        supabase
          .from('user_roles')
          .select('*')
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (rolesResponse.error) throw rolesResponse.error;

      setUsers(usersResponse.data);
      setRoles(rolesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load users and roles');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, roleId: string) => {
    try {
      const role = roles.find(r => r.id === roleId);
      if (!role) throw new Error('Role not found');

      const { error } = await supabase
        .from('profiles')
        .update({ role: role.name })
        .eq('id', userId);

      if (error) throw error;

      toast.success('User role updated successfully');
      fetchData();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E5BE]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-[#00E5BE]" />
          <h2 className="text-2xl font-bold text-gray-900">User Permissions</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-[#00E5BE]"
            />
          </div>
          <button
            onClick={fetchData}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => {
              const userRole = roles.find(r => r.name === user.role);
              const permissions = userRole?.permissions || [];

              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-[#00E5BE] flex items-center justify-center text-white">
                          {user.name?.[0] || user.email[0]}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'No name'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={userRole?.id || ''}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00E5BE] focus:border-[#00E5BE] sm:text-sm rounded-md"
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {permissions.map((permission) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#00E5BE] bg-opacity-10 text-[#00E5BE]"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {PERMISSIONS[permission].name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPermissions;