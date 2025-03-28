import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { User, Mail, Globe, Bell, Moon, Sun, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';

const UserProfile = () => {
  const {
    loading,
    error,
    profile,
    settings,
    preferences,
    updateProfile,
    updateSettings,
    updatePreferences,
    deleteAccount,
  } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar_url: '',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E5BE]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-800">Error loading profile: {error.message}</p>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      avatar_url: profile?.avatar_url || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const toggleTheme = async () => {
    try {
      await updateSettings({
        theme: settings?.theme === 'light' ? 'dark' : 'light',
      });
    } catch (error) {
      toast.error('Failed to update theme');
    }
  };

  const toggleNotifications = async () => {
    try {
      await updateSettings({
        notifications_enabled: !settings?.notifications_enabled,
      });
    } catch (error) {
      toast.error('Failed to update notification settings');
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-gray-900">Profile Settings</h3>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#00E5BE] focus:border-[#00E5BE]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
            <input
              type="text"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#00E5BE] focus:border-[#00E5BE]"
            />
          </div>

          <div className="flex justify-end space-x-2">
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
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">{profile?.name}</h4>
              <p className="text-gray-500">{profile?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Language</p>
                  <p className="text-sm text-gray-500">{preferences?.language || 'English'}</p>
                </div>
              </div>
              <button className="text-[#00E5BE] hover:text-[#00D1AD]">Change</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Notifications</p>
                  <p className="text-sm text-gray-500">
                    {settings?.notifications_enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleNotifications}
                className="text-[#00E5BE] hover:text-[#00D1AD]"
              >
                Toggle
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {settings?.theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900">Theme</p>
                  <p className="text-sm text-gray-500">
                    {settings?.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="text-[#00E5BE] hover:text-[#00D1AD]"
              >
                Toggle
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">
                    {preferences?.two_factor_enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <button className="text-[#00E5BE] hover:text-[#00D1AD]">Configure</button>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleDeleteAccount}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;