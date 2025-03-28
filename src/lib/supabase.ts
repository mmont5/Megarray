import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseAnonKey ? 'present' : 'missing'
  });
  throw new Error('Missing required Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: 'megarray.auth.token',
    storage: localStorage,
  },
});

// Handle auth state changes and errors in a single listener
supabase.auth.onAuthStateChange((event, session, error) => {
  if (error) {
    console.error('Supabase auth error:', error);
    return;
  }

  switch (event) {
    case 'SIGNED_OUT':
      // Clear only Supabase-related data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.') || key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      console.log('User signed out');
      break;

    case 'SIGNED_IN':
      console.log('User signed in:', session?.user?.email);
      break;

    case 'TOKEN_REFRESHED':
      console.log('Session token refreshed');
      break;

    case 'USER_UPDATED':
      console.log('User data updated');
      break;

    default:
      console.log('Auth event:', event);
  }
});