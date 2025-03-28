/*
  # Fix affiliate relationships and add missing columns

  1. Changes
    - Add missing columns to profiles table
    - Update foreign key relationships
    - Add indexes for performance
    - Update RLS policies

  2. Security
    - Maintain existing RLS policies
*/

-- Add missing columns to profiles table if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name text;

-- Update existing records to ensure full_name is populated
UPDATE profiles 
SET full_name = email
WHERE full_name IS NULL;

-- Create computed name column
ALTER TABLE profiles
DROP COLUMN IF EXISTS name,
ADD COLUMN name text GENERATED ALWAYS AS (full_name) STORED;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles(name);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);

-- Update foreign key relationships
ALTER TABLE affiliate_links
DROP CONSTRAINT IF EXISTS affiliate_links_user_id_fkey,
ADD CONSTRAINT affiliate_links_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE affiliate_payouts
DROP CONSTRAINT IF EXISTS affiliate_payouts_user_id_fkey,
ADD CONSTRAINT affiliate_payouts_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_links_user ON affiliate_links(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_user ON affiliate_payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_link ON affiliate_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_link ON affiliate_conversions(link_id);

-- Update RLS policies
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own affiliate links" ON affiliate_links;
DROP POLICY IF EXISTS "Users can create their own affiliate links" ON affiliate_links;
DROP POLICY IF EXISTS "Users can view their own affiliate payouts" ON affiliate_payouts;

CREATE POLICY "Users can view their own affiliate links"
  ON affiliate_links
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own affiliate links"
  ON affiliate_links
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own affiliate payouts"
  ON affiliate_payouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);