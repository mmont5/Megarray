/*
  # Content Moderation System

  1. New Tables
    - `content_moderation_rules`
      - Rules for content scanning
      - Configurable thresholds and actions
    
    - `content_violations`
      - Records of content that violates rules
      - Tracks actions taken and appeals

    - `content_appeals`
      - Appeal requests from enterprise users
      - Appeal status and resolution

  2. Security
    - Enable RLS
    - Add policies for admins and users
*/

-- Create content_moderation_rules table
CREATE TABLE IF NOT EXISTS content_moderation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL, -- hate, racism, adult, violence, illegal
  severity text NOT NULL, -- low, medium, high
  action text NOT NULL, -- warn, suspend, ban
  threshold integer NOT NULL, -- Number of violations before action
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content_violations table
CREATE TABLE IF NOT EXISTS content_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content_items NOT NULL,
  rule_id uuid REFERENCES content_moderation_rules NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  severity text NOT NULL,
  details jsonb DEFAULT '{}',
  action_taken text NOT NULL,
  is_appealed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create content_appeals table
CREATE TABLE IF NOT EXISTS content_appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  violation_id uuid REFERENCES content_violations NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users
);

-- Enable RLS
ALTER TABLE content_moderation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_appeals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage moderation rules"
  ON content_moderation_rules
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      INNER JOIN admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid()
      AND au.is_active = true
      AND ar.permissions && ARRAY['manage_content']
    )
  );

CREATE POLICY "Users can view their own violations"
  ON content_violations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage violations"
  ON content_violations
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      INNER JOIN admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid()
      AND au.is_active = true
      AND ar.permissions && ARRAY['manage_content']
    )
  );

CREATE POLICY "Users can view and create their own appeals"
  ON content_appeals
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM admin_users au
      INNER JOIN admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid()
      AND au.is_active = true
      AND ar.permissions && ARRAY['manage_content']
    )
  );

-- Insert default moderation rules
INSERT INTO content_moderation_rules 
  (name, description, category, severity, action, threshold)
VALUES
  ('Hate Speech', 'Content promoting hate or discrimination', 'hate', 'high', 'suspend', 1),
  ('Racism', 'Racist content or slurs', 'racism', 'high', 'suspend', 1),
  ('Adult Content', 'Explicit adult or NSFW content', 'adult', 'medium', 'suspend', 1),
  ('Violence', 'Excessive violence or gore', 'violence', 'high', 'suspend', 1),
  ('Illegal Activity', 'Content promoting illegal activities', 'illegal', 'high', 'ban', 1);

-- Create function to handle content moderation
CREATE OR REPLACE FUNCTION check_content_moderation()
RETURNS trigger AS $$
DECLARE
  _rule content_moderation_rules;
  _violation_count integer;
  _is_enterprise boolean;
BEGIN
  -- Check if user is enterprise
  SELECT EXISTS (
    SELECT 1 FROM subscriptions s
    INNER JOIN plans p ON s.plan_id = p.id
    WHERE s.user_id = NEW.creator_id
    AND p.name = 'Enterprise'
    AND s.status = 'active'
  ) INTO _is_enterprise;

  -- Check content against each active rule
  FOR _rule IN 
    SELECT * FROM content_moderation_rules 
    WHERE is_active = true
  LOOP
    -- Here you would integrate with AI content moderation service
    -- For now, we'll use a simple keyword check
    IF NEW.content ~* _rule.category THEN
      -- Count existing violations
      SELECT COUNT(*) INTO _violation_count
      FROM content_violations
      WHERE user_id = NEW.creator_id
      AND rule_id = _rule.id
      AND created_at > NOW() - INTERVAL '30 days';

      -- Create violation record
      INSERT INTO content_violations (
        content_id,
        rule_id,
        user_id,
        severity,
        action_taken
      ) VALUES (
        NEW.id,
        _rule.id,
        NEW.creator_id,
        _rule.severity,
        CASE 
          WHEN _violation_count >= _rule.threshold THEN _rule.action
          ELSE 'warn'
        END
      );

      -- If threshold exceeded, take action
      IF _violation_count >= _rule.threshold THEN
        -- For enterprise users, only suspend content
        IF _is_enterprise THEN
          NEW.status = 'suspended';
        ELSE
          -- For other users, apply full action
          CASE _rule.action
            WHEN 'suspend' THEN
              NEW.status = 'suspended';
            WHEN 'ban' THEN
              -- Update user status in profiles table
              UPDATE profiles 
              SET status = 'banned',
                  banned_at = NOW(),
                  ban_reason = _rule.category
              WHERE id = NEW.creator_id;
              NEW.status = 'removed';
          END CASE;
        END IF;

        -- Notify admins
        PERFORM pg_notify(
          'content_violation',
          json_build_object(
            'content_id', NEW.id,
            'user_id', NEW.creator_id,
            'rule', _rule.name,
            'action', _rule.action
          )::text
        );
      END IF;

      RETURN NEW;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for content moderation
CREATE TRIGGER check_content_moderation_trigger
  BEFORE INSERT OR UPDATE ON content_items
  FOR EACH ROW
  EXECUTE FUNCTION check_content_moderation();