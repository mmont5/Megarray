import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import * as auth from '../lib/auth';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  subscription?: {
    plan: string;
    status: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // For development, create a mock user with a valid UUID
  const mockUser: User = {
    id: '00000000-0000-0000-0000-000000000000', // Valid UUID format
    email: 'dev@example.com',
    role: 'admin',
    name: 'Dev User',
    subscription: {
      plan: 'business',
      status: 'active'
    }
  };

  const [user, setUser] = useState<User | null>(mockUser);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setUser(mockUser);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in');
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setUser(mockUser);
      navigate('/signup/role');
      toast.success('Account created successfully');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out');
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
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