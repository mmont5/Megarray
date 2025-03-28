import { TwitterApi } from 'twitter-api-v2';

const TWITTER_CLIENT_ID = import.meta.env.VITE_TWITTER_CLIENT_ID;
const TWITTER_REDIRECT_URI = `${window.location.origin}/auth/twitter/callback`;

// Create Twitter client
const client = new TwitterApi({
  clientId: TWITTER_CLIENT_ID,
  clientSecret: import.meta.env.VITE_TWITTER_CLIENT_SECRET,
});

export async function initiateTwitterAuth() {
  // Generate OAuth2 URL
  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
    TWITTER_REDIRECT_URI,
    { scope: ['tweet.read', 'users.read', 'offline.access'] }
  );

  // Store verifier and state for later use
  localStorage.setItem('twitter_oauth_state', state);
  localStorage.setItem('twitter_oauth_verifier', codeVerifier);

  // Redirect to Twitter auth
  window.location.href = url;
}

export async function handleTwitterCallback(code: string, state: string) {
  // Get stored values
  const storedState = localStorage.getItem('twitter_oauth_state');
  const codeVerifier = localStorage.getItem('twitter_oauth_verifier');

  if (!storedState || !codeVerifier || state !== storedState) {
    throw new Error('Invalid OAuth state');
  }

  // Exchange code for tokens
  const { accessToken, refreshToken } = await client.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: TWITTER_REDIRECT_URI,
  });

  // Clear stored values
  localStorage.removeItem('twitter_oauth_state');
  localStorage.removeItem('twitter_oauth_verifier');

  return { accessToken, refreshToken };
}

export async function getTwitterUserInfo(accessToken: string) {
  const userClient = new TwitterApi(accessToken);
  const me = await userClient.v2.me();
  return me.data;
}