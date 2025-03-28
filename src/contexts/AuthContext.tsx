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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const session = await auth.getSession();
      if (session) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      setUser({
        id: userId,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        subscription: subscription ? {
          plan: subscription.plans.name,
          status: subscription.status,
        } : undefined,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user: authUser } = await auth.signIn({ email, password });
      if (!authUser) throw new Error('Login failed');
      
      await loadUserData(authUser.id);
      
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
      const { user: authUser } = await auth.signUp({ email, password, name });
      if (!authUser) throw new Error('Signup failed');

      await loadUserData(authUser.id);
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
      await auth.signOut();
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