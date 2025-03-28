/*
  # Update name fields in profiles table

  1. Changes
    - Add first_name and last_name columns
    - Update computed name column to use first_name and last_name
    - Update existing records
    - Update indexes

  2. Security
    - Maintain existing RLS policies
*/

-- First drop the computed name column since it depends on full_name
ALTER TABLE profiles
DROP COLUMN IF EXISTS name;

-- Add new name columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- Update existing records by splitting full_name
UPDATE profiles 
SET 
  first_name = SPLIT_PART(COALESCE(full_name, email), ' ', 1),
  last_name = NULLIF(SPLIT_PART(COALESCE(full_name, email), ' ', 2), '');

-- Now we can safely drop the full_name column
ALTER TABLE profiles
DROP COLUMN IF EXISTS full_name;

-- Add the computed name column using first_name and last_name
ALTER TABLE profiles
ADD COLUMN name text GENERATED ALWAYS AS (
  CASE 
    WHEN last_name IS NOT NULL THEN first_name || ' ' || last_name 
    ELSE first_name 
  END
) STORED;

-- Create indexes for performance
DROP INDEX IF EXISTS idx_profiles_full_name;
CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles(name);
CREATE INDEX IF NOT EXISTS idx_profiles_first_name ON profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_profiles_last_name ON profiles(last_name);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), ' ', 1),
    NULLIF(SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), ' ', 2), ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'individual')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;