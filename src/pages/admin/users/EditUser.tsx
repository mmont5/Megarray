import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  settings?: {
    theme: string;
    notifications_enabled: boolean;
    email_frequency: string;
    timezone: string;
  };
  preferences?: {
    language: string;
    marketing_emails: boolean;
    two_factor_enabled: boolean;
  };
}

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_settings(*),
          user_preferences(*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: userData.full_name,
          email: userData.email,
          role: userData.role,
          status: userData.status,
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      if (userData.settings) {
        const { error: settingsError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: userId,
            ...userData.settings,
          });

        if (settingsError) throw settingsError;
      }

      if (userData.preferences) {
        const { error: preferencesError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: userId,
            ...userData.preferences,
          });

        if (preferencesError) throw preferencesError;
      }

      toast.success('User updated successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E5BE]"></div>
      </div>
    );
  }

  if (!userData) {
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
          <h2 className="text-2xl font-bold text-white">Edit User</h2>
        </div>
        <button
          onClick={handleSubmit}
          className="flex items-center px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <input
                type="text"
                value={userData.full_name}
                onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Role & Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Role</label>
              <select
                value={userData.role}
                onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              >
                <option value="individual">Individual</option>
                <option value="business">Business</option>
                <option value="agency">Agency</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Status</label>
              <select
                value={userData.status}
                onChange={(e) => setUserData({ ...userData, status: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Theme</label>
              <select
                value={userData.settings?.theme}
                onChange={(e) => setUserData({
                  ...userData,
                  settings: { ...userData.settings, theme: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email Frequency</label>
              <select
                value={userData.settings?.email_frequency}
                onChange={(e) => setUserData({
                  ...userData,
                  settings: { ...userData.settings, email_frequency: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={userData.settings?.notifications_enabled}
                  onChange={(e) => setUserData({
                    ...userData,
                    settings: { ...userData.settings, notifications_enabled: e.target.checked }
                  })}
                  className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
                />
                <span className="ml-2 text-sm text-gray-300">Enable Notifications</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Language</label>
              <select
                value={userData.preferences?.language}
                onChange={(e) => setUserData({
                  ...userData,
                  preferences: { ...userData.preferences, language: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={userData.preferences?.marketing_emails}
                  onChange={(e) => setUserData({
                    ...userData,
                    preferences: { ...userData.preferences, marketing_emails: e.target.checked }
                  })}
                  className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
                />
                <span className="ml-2 text-sm text-gray-300">Receive Marketing Emails</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={userData.preferences?.two_factor_enabled}
                  onChange={(e) => setUserData({
                    ...userData,
                    preferences: { ...userData.preferences, two_factor_enabled: e.target.checked }
                  })}
                  className="rounded bg-gray-700 border-gray-600 text-[#00E5BE] focus:ring-[#00E5BE]"
                />
                <span className="ml-2 text-sm text-gray-300">Enable Two-Factor Authentication</span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUser;