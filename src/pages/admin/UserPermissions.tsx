import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { PERMISSIONS } from '../../lib/permissions';

interface User {
  id: string;
  email: string;
  role: string;
  full_name: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const UserPermissions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, email, role, full_name')
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

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
          <Shield className="w-5 h-5 text-[#00E5BE]" />
          <h2 className="text-2xl font-bold text-gray-900">User Permissions</h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-[#00E5BE]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-[#00E5BE]"
        >
          <option value="all">All Roles</option>
          <option value="individual">Individual</option>
          <option value="business">Business</option>
          <option value="agency">Agency</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => {
              const userRole = roles.find(r => r.name === user.role);
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.full_name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="text-sm border-gray-300 rounded-lg focus:ring-[#00E5BE] focus:border-[#00E5BE]"
                    >
                      <option value="individual">Individual</option>
                      <option value="business">Business</option>
                      <option value="agency">Agency</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {userRole?.permissions?.map((permission: string) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#00E5BE] bg-opacity-10 text-[#00E5BE]"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {PERMISSIONS[permission as keyof typeof PERMISSIONS]?.name || permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {/* Implement edit permissions */}}
                      className="text-[#00E5BE] hover:text-[#00D1AD] text-sm font-medium"
                    >
                      Edit Permissions
                    </button>
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