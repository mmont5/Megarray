import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signUp({ email, password, name }: SignUpData) {
  try {
    console.log('Attempting signup:', { email, name });
    
    // Split name into first and last name
    const [firstName, ...lastNameParts] = name.trim().split(' ');
    const lastName = lastNameParts.join(' ');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName || null,
          role: 'individual',
        },
      },
    });

    if (error) {
      console.error('Signup error:', error);
      throw error;
    }

    console.log('Signup successful:', data);
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function signIn({ email, password }: SignInData) {
  try {
    console.log('Attempting sign in:', { email });

    // First check if user exists in profiles
    const { data: existingUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    // Only throw error if it's not a "no rows returned" error
    if (userError && userError.code !== 'PGRST116') {
      console.error('Profile check error:', userError);
      throw new Error('Unable to verify user account');
    }

    // Sign in with Supabase Auth
    console.log('Calling supabase.auth.signInWithPassword');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw new Error(getAuthErrorMessage(error));
    }

    if (!data.user) {
      console.error('Login successful but no user data returned');
      throw new Error('Login successful but no user data returned');
    }

    // If we successfully logged in but no profile exists, create one
    if (!existingUser) {
      console.log('Creating new profile for user:', data.user.id);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.user_metadata?.first_name || email.split('@')[0],
          last_name: data.user.user_metadata?.last_name,
          role: 'individual',
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw here - user is still logged in
      }
    }

    console.log('Login successful:', data);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Signout error:', error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Password update error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    throw error;
  }
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

function getAuthErrorMessage(error: any): string {
  // Map Supabase error codes to user-friendly messages
  const errorMessages: { [key: string]: string } = {
    'invalid_credentials': 'Incorrect email or password. Please try again.',
    'user_not_found': 'No account found with this email address.',
    'email_taken': 'An account with this email already exists.',
    'weak_password': 'Password is too weak. It should be at least 6 characters long.',
    'invalid_email': 'Please enter a valid email address.',
    'rate_limit_exceeded': 'Too many attempts. Please try again later.',
    'email_not_confirmed': 'Please verify your email address before logging in.',
    'expired_token': 'Your session has expired. Please log in again.',
    'invalid_grant': 'Incorrect email or password. Please try again.',
    'invalid_request': 'Invalid request. Please try again.',
    'auth_error': 'Authentication error. Please try again.',
  };

  // Get error code from Supabase error
  const errorCode = error.code || error.message?.toLowerCase().replace(/\s+/g, '_') || 'unknown_error';
  
  // Return mapped message or default error message
  return errorMessages[errorCode] || error.message || 'An unexpected error occurred. Please try again.';
}