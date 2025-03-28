/*
  # Fix subscription usage table structure

  1. Changes
    - Drop existing subscription_usage table
    - Recreate with correct structure
    - Add proper foreign key relationships
    - Update RLS policies

  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS subscription_usage;

-- Create subscription_usage table with correct structure
CREATE TABLE subscription_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions ON DELETE CASCADE NOT NULL,
  feature text NOT NULL,
  used_amount integer NOT NULL DEFAULT 0,
  max_allowed integer NOT NULL,
  reset_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own usage
CREATE POLICY "Users can view their own usage"
  ON subscription_usage
  FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX idx_subscription_usage_subscription ON subscription_usage(subscription_id);
CREATE INDEX idx_subscription_usage_feature ON subscription_usage(feature);
CREATE INDEX idx_subscription_usage_reset ON subscription_usage(reset_at);

-- Create function to initialize usage tracking for new subscriptions
CREATE OR REPLACE FUNCTION initialize_subscription_usage()
RETURNS trigger AS $$
BEGIN
  -- Initialize usage tracking for common features
  INSERT INTO subscription_usage (
    subscription_id,
    feature,
    used_amount,
    max_allowed,
    reset_at
  ) VALUES
    (NEW.id, 'ai_credits', 0, 
      CASE 
        WHEN NEW.plan_id = (SELECT id FROM plans WHERE name = 'free') THEN 100
        WHEN NEW.plan_id = (SELECT id FROM plans WHERE name = 'pro') THEN 1000
        ELSE -1
      END,
      NEW.current_period_end),
    (NEW.id, 'storage', 0,
      CASE 
        WHEN NEW.plan_id = (SELECT id FROM plans WHERE name = 'free') THEN 104857600 -- 100MB
        WHEN NEW.plan_id = (SELECT id FROM plans WHERE name = 'pro') THEN 1073741824 -- 1GB
        ELSE -1
      END,
      NEW.current_period_end),
    (NEW.id, 'team_members', 0,
      CASE 
        WHEN NEW.plan_id = (SELECT id FROM plans WHERE name = 'free') THEN 1
        WHEN NEW.plan_id = (SELECT id FROM plans WHERE name = 'pro') THEN 3
        ELSE -1
      END,
      NEW.current_period_end);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new subscriptions
CREATE TRIGGER on_subscription_created
  AFTER INSERT ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION initialize_subscription_usage();