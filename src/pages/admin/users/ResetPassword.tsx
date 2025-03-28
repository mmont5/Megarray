import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';

const ResetPassword = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [method, setMethod] = useState<'email' | 'manual'>('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) throw error;
      toast.success('Password reset email sent');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('Failed to send reset email');
    }
  };

  const handleManualReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.admin.updateUserById(
        userId!,
        { password: newPassword }
      );

      if (error) throw error;
      toast.success('Password updated successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
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
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
            <Key className="w-6 h-6 text-[#00E5BE]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{user.full_name}</h3>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Reset Method</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setMethod('email')}
                className={`p-4 rounded-lg border-2 ${
                  method === 'email'
                    ? 'border-[#00E5BE] bg-[#00E5BE]/10'
                    : 'border-gray-700 hover:border-[#00E5BE]'
                } transition-colors duration-300`}
              >
                <Mail className="w-6 h-6 text-[#00E5BE] mb-2" />
                <h4 className="text-white font-medium">Send Reset Email</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Send a password reset link to the user's email
                </p>
              </button>

              <button
                onClick={() => setMethod('manual')}
                className={`p-4 rounded-lg border-2 ${
                  method === 'manual'
                    ? 'border-[#00E5BE] bg-[#00E5BE]/10'
                    : 'border-gray-700 hover:border-[#00E5BE]'
                } transition-colors duration-300`}
              >
                <Key className="w-6 h-6 text-[#00E5BE] mb-2" />
                <h4 className="text-white font-medium">Manual Reset</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Set a new password manually
                </p>
              </button>
            </div>
          </div>

          {method === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={method === 'email' ? handleEmailReset : handleManualReset}
              className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
            >
              {method === 'email' ? 'Send Reset Email' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700/50">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />
          <div>
            <h5 className="text-white font-medium">Important Security Notice</h5>
            <p className="mt-1 text-sm text-gray-400">
              Resetting a user's password will invalidate their current sessions and require them to log in again.
              Make sure to communicate this change to the user.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;