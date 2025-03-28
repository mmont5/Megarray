import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as userManagement from '../lib/user-management';
import type { UserProfile, UserSettings, UserPreferences } from '../lib/user-management';

export function useUser() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        const [userProfile, userSettings, userPreferences] = await Promise.all([
          userManagement.getUserProfile(user.id),
          userManagement.getUserSettings(user.id),
          userManagement.getUserPreferences(user.id),
        ]);

        setProfile(userProfile);
        setSettings(userSettings);
        setPreferences(userPreferences);
        setError(null);
      } catch (err) {
        console.error('Error loading user data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const updatedProfile = await userManagement.updateUserProfile(user.id, updates);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;
    try {
      const updatedSettings = await userManagement.updateUserSettings(user.id, updates);
      setSettings(updatedSettings);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;
    try {
      const updatedPreferences = await userManagement.updateUserPreferences(user.id, updates);
      setPreferences(updatedPreferences);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      await userManagement.deleteUserAccount(user.id);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    loading,
    error,
    profile,
    settings,
    preferences,
    updateProfile,
    updateSettings,
    updatePreferences,
    deleteAccount,
  };
}