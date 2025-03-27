/*
  # Create subscriptions and payments tables

  1. New Tables
    - `plans`
      - `id` (uuid, primary key)
      - `name` (text) - Plan name (Free, Pro, Business, Enterprise)
      - `price` (integer) - Price in cents
      - `features` (jsonb) - List of features included
      - `limits` (jsonb) - Usage limits
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `plan_id` (uuid, references plans)
      - `status` (text) - active, canceled, past_due
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `cancel_at_period_end` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `payment_methods`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `type` (text) - card, crypto, apple_pay, google_pay
      - `details` (jsonb) - Payment method details
      - `is_default` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  features jsonb NOT NULL DEFAULT '[]',
  limits jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan_id uuid REFERENCES plans NOT NULL,
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Plans are viewable by all authenticated users"
  ON plans
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payment methods"
  ON payment_methods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default plans
INSERT INTO plans (name, price, features, limits) VALUES
  ('Free', 0, '["AI content generation", "Basic analytics", "Single user", "Standard support"]'::jsonb, '{"credits": 100, "users": 1}'::jsonb),
  ('Pro', 4900, '["AI content generation", "Advanced analytics", "Up to 3 team members", "Priority support", "Custom templates"]'::jsonb, '{"credits": 1000, "users": 3}'::jsonb),
  ('Business', 9900, '["AI content generation", "Enterprise analytics", "Unlimited team members", "24/7 priority support", "Custom templates", "API access"]'::jsonb, '{"credits": -1, "users": -1}'::jsonb),
  ('Enterprise', 0, '["Custom AI models", "Dedicated support", "Custom integrations", "SLA", "Training & onboarding"]'::jsonb, '{"credits": -1, "users": -1}'::jsonb);