import { supabase } from './supabase';

export async function initiateGithubAuth() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          client_id: 'Ov23li9kFf7zibx59461',
        },
      },
    });

    if (error) throw error;
    if (!data.url) throw new Error('No redirect URL returned');

    // Redirect to GitHub
    window.location.href = data.url;
  } catch (error) {
    console.error('GitHub auth error:', error);
    throw error;
  }
}

export async function handleGithubCallback(code: string, state: string) {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session) throw new Error('No session found');

    return {
      id: data.session.user.id,
      email: data.session.user.email,
      name: data.session.user.user_metadata.full_name || data.session.user.user_metadata.name,
      avatar_url: data.session.user.user_metadata.avatar_url,
      access_token: data.session.access_token,
      provider: 'github',
    };
  } catch (error) {
    console.error('GitHub callback error:', error);
    throw error;
  }
}