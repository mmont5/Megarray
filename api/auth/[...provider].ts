import { NextApiRequest, NextApiResponse } from 'next';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as AppleStrategy } from 'passport-apple';
import jwt from 'jsonwebtoken';
import dbConnect from '../db/connect';
import User from '../models/User';

// Initialize passport
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    await dbConnect();
    const existingUser = await User.findOne({ email: profile.emails![0].value });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = await User.create({
      name: profile.displayName,
      email: profile.emails![0].value,
      role: 'individual',
      plan: 'free',
      authProvider: 'google',
      authProviderId: profile.id,
    });

    return done(null, newUser);
  } catch (error) {
    return done(error as Error);
  }
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID!,
  clientSecret: process.env.FACEBOOK_APP_SECRET!,
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    await dbConnect();
    const existingUser = await User.findOne({ email: profile.emails![0].value });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = await User.create({
      name: profile.displayName,
      email: profile.emails![0].value,
      role: 'individual',
      plan: 'free',
      authProvider: 'facebook',
      authProviderId: profile.id,
    });

    return done(null, newUser);
  } catch (error) {
    return done(error as Error);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: '/api/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    await dbConnect();
    const existingUser = await User.findOne({ email: profile.emails![0].value });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = await User.create({
      name: profile.displayName,
      email: profile.emails![0].value,
      role: 'individual',
      plan: 'free',
      authProvider: 'github',
      authProviderId: profile.id,
    });

    return done(null, newUser);
  } catch (error) {
    return done(error as Error);
  }
}));

passport.use(new AppleStrategy({
  clientID: process.env.APPLE_CLIENT_ID!,
  teamID: process.env.APPLE_TEAM_ID!,
  keyID: process.env.APPLE_KEY_ID!,
  privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH!,
  callbackURL: '/api/auth/apple/callback',
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    await dbConnect();
    const existingUser = await User.findOne({ email: profile.email });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = await User.create({
      name: profile.name?.firstName + ' ' + profile.name?.lastName,
      email: profile.email,
      role: 'individual',
      plan: 'free',
      authProvider: 'apple',
      authProviderId: profile.id,
    });

    return done(null, newUser);
  } catch (error) {
    return done(error as Error);
  }
}));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider } = req.query;

  if (!provider || Array.isArray(provider)) {
    return res.status(400).json({ error: 'Invalid provider' });
  }

  if (req.method === 'GET') {
    switch (provider) {
      case 'google':
      case 'facebook':
      case 'github':
      case 'apple':
        passport.authenticate(provider, {
          scope: provider === 'google' ? ['profile', 'email'] :
                 provider === 'facebook' ? ['email'] :
                 provider === 'github' ? ['user:email'] :
                 ['name', 'email'],
          session: false,
        })(req, res);
        break;
      default:
        res.status(400).json({ error: 'Invalid provider' });
    }
  } else if (req.method === 'GET' && req.url?.includes('/callback')) {
    passport.authenticate(provider, { session: false }, (err: any, user: any) => {
      if (err || !user) {
        return res.redirect('/login?error=auth_failed');
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.redirect(`/auth/callback?token=${token}`);
    })(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}