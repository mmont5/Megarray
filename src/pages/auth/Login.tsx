import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const Login = () => {
  const handleGithubLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;
      if (!data.url) throw new Error('No redirect URL returned');

      // Redirect to GitHub
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link 
          to="/" 
          className="flex justify-center text-2xl font-bold text-[#00E5BE]"
        >
          Megarray
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="font-medium text-[#00E5BE] hover:text-[#00D1AD]"
          >
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <button
            onClick={handleGithubLogin}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            <Github className="w-5 h-5 mr-2" />
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;