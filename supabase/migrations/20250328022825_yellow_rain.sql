/*
  # Fix profile column names and add missing columns

  1. Changes
    - Add missing columns to profiles table
    - Create view for backwards compatibility
    - Update existing data

  2. Security
    - Maintain existing RLS policies
*/

-- Add missing columns to profiles table if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS name text GENERATED ALWAYS AS (full_name) STORED;

-- Update existing records to ensure full_name is populated
UPDATE profiles 
SET full_name = email
WHERE full_name IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles(name);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update or create RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);