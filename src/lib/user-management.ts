import { supabase } from './supabase';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserSettings {
  theme: string;
  notifications_enabled: boolean;
  email_frequency: string;
  timezone: string;
}

export interface UserPreferences {
  language: string;
  marketing_emails: boolean;
  two_factor_enabled: boolean;
}

export interface UserActivityLog {
  id: string;
  action_type: string;
  action_details: Record<string, any>;
  created_at: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    toast.success('Profile updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    toast.error('Failed to update profile');
    throw error;
  }
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
}

export async function updateUserSettings(userId: string, updates: Partial<UserSettings>) {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    toast.success('Settings updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    toast.error('Failed to update settings');
    throw error;
  }
}

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }
}

export async function updateUserPreferences(userId: string, updates: Partial<UserPreferences>) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .update({
        ...updates,
        last_preferences_update: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    toast.success('Preferences updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    toast.error('Failed to update preferences');
    throw error;
  }
}

export async function getUserActivityLog(userId: string, limit = 10): Promise<UserActivityLog[]> {
  try {
    const { data, error } = await supabase
      .from('user_activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user activity log:', error);
    throw error;
  }
}

export async function logUserActivity(
  userId: string,
  actionType: string,
  actionDetails: Record<string, any>
) {
  try {
    const { error } = await supabase
      .from('user_activity_log')
      .insert({
        user_id: userId,
        action_type: actionType,
        action_details: actionDetails,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging user activity:', error);
    // Don't throw here - logging failure shouldn't break the app
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    // Delete user data in correct order due to foreign key constraints
    await Promise.all([
      supabase.from('user_activity_log').delete().eq('user_id', userId),
      supabase.from('user_preferences').delete().eq('user_id', userId),
      supabase.from('user_settings').delete().eq('user_id', userId),
    ]);

    // Delete auth user (this will cascade to profile)
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;

    toast.success('Account deleted successfully');
  } catch (error) {
    console.error('Error deleting user account:', error);
    toast.error('Failed to delete account');
    throw error;
  }
}

export async function enableTwoFactor(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .update({
        two_factor_enabled: true,
        last_preferences_update: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    toast.success('Two-factor authentication enabled');
    return data;
  } catch (error) {
    console.error('Error enabling two-factor auth:', error);
    toast.error('Failed to enable two-factor authentication');
    throw error;
  }
}

export async function disableTwoFactor(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .update({
        two_factor_enabled: false,
        last_preferences_update: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    toast.success('Two-factor authentication disabled');
    return data;
  } catch (error) {
    console.error('Error disabling two-factor auth:', error);
    toast.error('Failed to disable two-factor authentication');
    throw error;
  }
}