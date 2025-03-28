/*
  # Fix affiliate table relationships

  1. Changes
    - Add missing foreign key relationships between affiliate tables and profiles
    - Update existing tables to use proper references
    - Add indexes for performance

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS affiliate_links
DROP CONSTRAINT IF EXISTS affiliate_links_user_id_fkey;

ALTER TABLE IF EXISTS affiliate_payouts 
DROP CONSTRAINT IF EXISTS affiliate_payouts_user_id_fkey;

-- Update affiliate_links table
ALTER TABLE affiliate_links
ADD CONSTRAINT affiliate_links_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update affiliate_payouts table
ALTER TABLE affiliate_payouts
ADD CONSTRAINT affiliate_payouts_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_links_user ON affiliate_links(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_user ON affiliate_payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_link ON affiliate_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_link ON affiliate_conversions(link_id);

-- Update RLS policies
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