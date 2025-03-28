-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL DEFAULT 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create subscription_items table
CREATE TABLE IF NOT EXISTS subscription_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions ON DELETE CASCADE NOT NULL,
  stripe_price_id text,
  stripe_product_id text,
  quantity integer DEFAULT 1,
  unit_amount integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create subscription_usage table
CREATE TABLE IF NOT EXISTS subscription_usage (
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
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscription items"
  ON subscription_items
  FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own usage"
  ON subscription_usage
  FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

-- Create function to handle subscription updates
CREATE OR REPLACE FUNCTION handle_subscription_update()
RETURNS trigger AS $$
BEGIN
  -- Update user's subscription status in profile
  UPDATE profiles
  SET 
    subscription_status = NEW.status,
    subscription_updated_at = NEW.updated_at
  WHERE id = NEW.user_id;

  -- If subscription is canceled, update profile
  IF NEW.status = 'canceled' THEN
    UPDATE profiles
    SET subscription_ended_at = NEW.canceled_at
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for subscription updates
CREATE TRIGGER on_subscription_updated
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_subscription_update();

-- Create function to check usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id uuid,
  p_feature text
) RETURNS boolean AS $$
DECLARE
  v_usage record;
BEGIN
  SELECT 
    su.used_amount,
    su.max_allowed,
    su.reset_at
  INTO v_usage
  FROM subscriptions s
  JOIN subscription_usage su ON su.subscription_id = s.id
  WHERE s.user_id = p_user_id
  AND su.feature = p_feature
  AND s.status = 'active'
  LIMIT 1;

  -- If no usage record found, allow access
  IF v_usage IS NULL THEN
    RETURN true;
  END IF;

  -- If past reset date, reset usage
  IF CURRENT_TIMESTAMP >= v_usage.reset_at THEN
    UPDATE subscription_usage
    SET 
      used_amount = 0,
      reset_at = CURRENT_TIMESTAMP + INTERVAL '1 month',
      updated_at = CURRENT_TIMESTAMP
    WHERE subscription_id = (
      SELECT id FROM subscriptions WHERE user_id = p_user_id
    )
    AND feature = p_feature;
    
    RETURN true;
  END IF;

  -- Check if within limits
  RETURN v_usage.used_amount < v_usage.max_allowed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;