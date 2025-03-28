import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Calendar, Globe, Shield, Key, Lock,
  Clock, Activity, AlertTriangle, CheckCircle, Settings,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['individual', 'business', 'agency', 'admin']),
  status: z.enum(['active', 'suspended', 'banned']),
});

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_settings(*),
          user_preferences(*),
          user_activity_log(*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const validatedData = UserSchema.parse(formData);

      const { error } = await supabase
        .from('profiles')
        .update(validatedData)
        .eq('id', userId);

      if (error) throw error;

      toast.success('User details updated successfully');
      setIsEditing(false);
      fetchUserDetails();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user details');
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
        <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
        <button
          onClick={() => navigate('/admin/users')}
          className="mt-4 text-[#00E5BE] hover:text-[#00D1AD]"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
            >
              Edit User
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#00E5BE] focus:border-[#00E5BE]"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#00E5BE] focus:border-[#00E5BE]"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                {isEditing ? (
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#00E5BE] focus:border-[#00E5BE]"
                  >
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                    <option value="agency">Agency</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{user.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                {isEditing ? (
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#00E5BE] focus:border-[#00E5BE]"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
            <div className="space-y-4">
              {user.user_activity_log?.map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <Activity className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-900">{activity.action_type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                    {activity.action_details && (
                      <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        {JSON.stringify(activity.action_details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Theme</label>
                {isEditing ? (
                  <select
                    value={formData.user_settings?.theme || 'light'}
                    onChange={(e) => setFormData({
                      ...formData,
                      user_settings: { ...formData.user_settings, theme: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#00E5BE] focus:border-[#00E5BE]"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{user.user_settings?.theme || 'Light'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email Frequency</label>
                {isEditing ? (
                  <select
                    value={formData.user_settings?.email_frequency || 'daily'}
                    onChange={(e) => setFormData({
                      ...formData,
                      user_settings: { ...formData.user_settings, email_frequency: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#00E5BE] focus:border-[#00E5BE]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="never">Never</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{user.user_settings?.email_frequency || 'Daily'}</p>
                )}
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.user_settings?.notifications_enabled}
                    onChange={(e) => setFormData({
                      ...formData,
                      user_settings: { ...formData.user_settings, notifications_enabled: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-[#00E5BE] focus:ring-[#00E5BE]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Notifications</span>
                </label>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.user_preferences?.two_factor_enabled}
                    onChange={(e) => setFormData({
                      ...formData,
                      user_preferences: { ...formData.user_preferences, two_factor_enabled: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-[#00E5BE] focus:ring-[#00E5BE]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Two-Factor Authentication</span>
                </label>
              </div>

              <button
                onClick={() => {/* Implement password reset */}}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Key className="w-4 h-4 mr-2" />
                Reset Password
              </button>

              <button
                onClick={() => {/* Implement security audit */}}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security Audit
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <button
                onClick={() => {/* Implement account suspension */}}
                className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-100"
              >
                <Lock className="w-4 h-4 mr-2" />
                Suspend Account
              </button>

              <button
                onClick={() => {/* Implement account deletion */}}
                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;