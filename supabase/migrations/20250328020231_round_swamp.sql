/*
  # Update profiles table and user settings

  1. Changes
    - Add missing columns to profiles table
    - Create user settings tables
    - Add triggers for new user setup

  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  theme text DEFAULT 'light',
  notifications_enabled boolean DEFAULT true,
  email_frequency text DEFAULT 'daily',
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_activity_log table
CREATE TABLE IF NOT EXISTS user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  action_type text NOT NULL,
  action_details jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  language text DEFAULT 'en',
  marketing_emails boolean DEFAULT true,
  two_factor_enabled boolean DEFAULT false,
  last_preferences_update timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can read own settings" ON user_settings;
  DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
  DROP POLICY IF EXISTS "Users can read own activity" ON user_activity_log;
  DROP POLICY IF EXISTS "Users can read own preferences" ON user_preferences;
  DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies
CREATE POLICY "Users can read own settings"
  ON user_settings
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own activity"
  ON user_activity_log
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id);

-- Create functions for handling new users
CREATE OR REPLACE FUNCTION handle_new_user_settings()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION handle_new_user_preferences()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DO $$ 
BEGIN
  DROP TRIGGER IF EXISTS on_profile_created ON profiles;
  DROP TRIGGER IF EXISTS on_profile_created_preferences ON profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create triggers
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_settings();

CREATE TRIGGER on_profile_created_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_preferences();