import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { PERMISSIONS, PermissionName } from '../../lib/permissions';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: PermissionName[];
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
    if (!confirm('Are you sure you want to delete this role?')) return;

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

    return (
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#00E5BE] focus:border-[#00E5BE]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#00E5BE] focus:border-[#00E5BE]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Object.entries(PERMISSIONS).map(([key, permission]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(key as PermissionName)}
                  onChange={(e) => {
                    const permissions = e.target.checked
                      ? [...formData.permissions, key as PermissionName]
                      : formData.permissions.filter(p => p !== key);
                    setFormData({ ...formData, permissions });
                  }}
                  className="h-4 w-4 text-[#00E5BE] focus:ring-[#00E5BE] border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  {permission.name}
                  <span className="ml-2 text-xs text-gray-500">{permission.description}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ id: role.id!, ...formData } as Role)}
            className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
          >
            Save Role
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
          <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
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
            className="p-6 bg-white rounded-xl border border-gray-200 hover:border-[#00E5BE] transition-all duration-300"
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
                    <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="p-2 text-gray-400 hover:text-gray-600"
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
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {PERMISSIONS[permission].name}
                      </span>
                    ))}
                  </div>
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