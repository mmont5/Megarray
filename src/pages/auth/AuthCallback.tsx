import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Fetch user data and update context
      fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          updateUser(data.user);
          navigate('/dashboard');
        })
        .catch(() => {
          navigate('/login?error=auth_failed');
        });
    } else {
      navigate('/login?error=no_token');
    }
  }, [searchParams, navigate, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E5BE]"></div>
    </div>
  );
};

export default AuthCallback;