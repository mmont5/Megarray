/*
  # Create affiliate system tables

  1. New Tables
    - `affiliate_links`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `code` (text, unique)
      - `description` (text)
      - `commission_rate` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `affiliate_clicks`
      - `id` (uuid, primary key)
      - `link_id` (uuid, references affiliate_links)
      - `ip_address` (text)
      - `user_agent` (text)
      - `referrer` (text)
      - `created_at` (timestamptz)

    - `affiliate_conversions`
      - `id` (uuid, primary key)
      - `link_id` (uuid, references affiliate_links)
      - `referred_user_id` (uuid, references auth.users)
      - `plan_id` (uuid, references plans)
      - `amount` (numeric)
      - `commission_amount` (numeric)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `affiliate_payouts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric)
      - `status` (text)
      - `payout_method` (text)
      - `payout_details` (jsonb)
      - `processed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS affiliate_clicks CASCADE;
DROP TABLE IF EXISTS affiliate_conversions CASCADE;
DROP TABLE IF EXISTS affiliate_payouts CASCADE;
DROP TABLE IF EXISTS affiliate_links CASCADE;

-- Create affiliate_links table
CREATE TABLE affiliate_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  commission_rate numeric NOT NULL DEFAULT 0.1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create affiliate_clicks table
CREATE TABLE affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid REFERENCES affiliate_links NOT NULL,
  ip_address text,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Create affiliate_conversions table
CREATE TABLE affiliate_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid REFERENCES affiliate_links NOT NULL,
  referred_user_id uuid REFERENCES auth.users NOT NULL,
  plan_id uuid REFERENCES plans NOT NULL,
  amount numeric NOT NULL,
  commission_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create affiliate_payouts table
CREATE TABLE affiliate_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payout_method text NOT NULL,
  payout_details jsonb NOT NULL DEFAULT '{}',
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own affiliate links" ON affiliate_links;
DROP POLICY IF EXISTS "Users can create their own affiliate links" ON affiliate_links;
DROP POLICY IF EXISTS "Users can view their own affiliate clicks" ON affiliate_clicks;
DROP POLICY IF EXISTS "Users can view their own affiliate conversions" ON affiliate_conversions;
DROP POLICY IF EXISTS "Users can view their own affiliate payouts" ON affiliate_payouts;

-- Create new policies
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

CREATE POLICY "Users can view their own affiliate clicks"
  ON affiliate_clicks
  FOR SELECT
  TO authenticated
  USING (
    link_id IN (
      SELECT id FROM affiliate_links WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own affiliate conversions"
  ON affiliate_conversions
  FOR SELECT
  TO authenticated
  USING (
    link_id IN (
      SELECT id FROM affiliate_links WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own affiliate payouts"
  ON affiliate_payouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);