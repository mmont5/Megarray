import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();

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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-medium text-[#00E5BE] hover:text-[#00D1AD]"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#00E5BE',
                    brandAccent: '#00D1AD',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full bg-[#00E5BE] hover:bg-[#00D1AD] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200',
                input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent',
                label: 'block text-sm font-medium text-gray-700 mb-1',
              },
            }}
            providers={[]}
            view="sign_up"
            redirectTo={`${window.location.origin}/signup/role`}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;