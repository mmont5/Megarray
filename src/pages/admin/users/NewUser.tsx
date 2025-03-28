import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';

const NewUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    full_name: '',
    role: 'individual',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userData.password !== userData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
        });

      if (profileError) throw profileError;

      toast.success('User created successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-white">Create New User</h2>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          Create User
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">User Information</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <input
                type="text"
                value={userData.full_name}
                onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                required
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                required
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
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
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Set Password</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                required
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <input
                type="password"
                value={userData.confirmPassword}
                onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                required
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewUser;