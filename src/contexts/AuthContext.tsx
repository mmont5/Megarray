import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { initiateGithubAuth, handleGithubCallback } from '../lib/github-auth';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar_url: string;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  handleAuthCallback: (code: string, state: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for stored auth data
    const storedAuth = localStorage.getItem('github_auth');
    if (storedAuth) {
      setUser(JSON.parse(storedAuth));
    }
    setLoading(false);
  }, []);

  const login = async () => {
    try {
      await initiateGithubAuth();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to initiate login');
    }
  };

  const handleAuthCallback = async (code: string, state: string) => {
    try {
      const userData = await handleGithubCallback(code, state);
      
      setUser(userData);
      localStorage.setItem('github_auth', JSON.stringify(userData));

      // Redirect to intended destination or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
      
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error('Auth callback error:', error);
      toast.error('Authentication failed');
      navigate('/login');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('github_auth');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, handleAuthCallback }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};