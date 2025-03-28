import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit2, Trash2, Save, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { PERMISSIONS, PermissionName } from '../../lib/permissions';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: PermissionName[];
  created_at: string;
  updated_at: string;
}

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async (role: Role) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(`Role ${role.id ? 'updated' : 'created'} successfully`);
      fetchRoles();
      setEditingRole(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  const RoleForm = ({ role, onSave, onCancel }: {
    role: Partial<Role>,
    onSave: (role: Role) => void,
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState({
      name: role.name || '',
      description: role.description || '',
      permissions: role.permissions || [],
    });

    const permissionCategories = Object.entries(PERMISSIONS).reduce((acc, [key, permission]) => {
      const category = permission.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ key, ...permission });
      return acc;
    }, {} as Record<string, any[]>);

    return (
      <div className="space-y-6 bg-gray-800 rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Role Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#00E5BE] focus:border-[#00E5BE]"
            placeholder="Enter role name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#00E5BE] focus:border-[#00E5BE]"
            rows={3}
            placeholder="Enter role description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">Permissions</label>
          <div className="space-y-6">
            {Object.entries(permissionCategories).map(([category, permissions]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-white capitalize">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {permissions.map((permission) => (
                    <div key={permission.key} className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.key as PermissionName)}
                        onChange={(e) => {
                          const permissions = e.target.checked
                            ? [...formData.permissions, permission.key as PermissionName]
                            : formData.permissions.filter(p => p !== permission.key);
                          setFormData({ ...formData, permissions });
                        }}
                        className="mt-1 h-4 w-4 text-[#00E5BE] focus:ring-[#00E5BE] bg-gray-700 border-gray-600 rounded"
                      />
                      <div className="ml-3">
                        <label className="text-sm font-medium text-white">
                          {permission.name}
                        </label>
                        <p className="text-xs text-gray-400">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ id: role.id!, ...formData } as Role)}
            disabled={!formData.name}
            className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] disabled:opacity-50"
          >
            {role.id ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </div>
    );
  };

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
          <h2 className="text-2xl font-bold text-white">Role Management</h2>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Role
        </button>
      </div>

      {isCreating && (
        <RoleForm
          role={{}}
          onSave={handleSaveRole}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="grid grid-cols-1 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-300"
          >
            {editingRole?.id === role.id ? (
              <RoleForm
                role={role}
                onSave={handleSaveRole}
                onCancel={() => setEditingRole(null)}
              />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white">{role.name}</h3>
                    <p className="text-sm text-gray-400">{role.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#00E5BE] bg-opacity-10 text-[#00E5BE]"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {PERMISSIONS[permission].name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-400">
                  Last updated: {new Date(role.updated_at).toLocaleDateString()}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleManagement;