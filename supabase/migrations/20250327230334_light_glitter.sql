/*
  # Create user roles and permissions system

  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `permissions` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for admin access
    - Add default roles with permissions
*/

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  permissions jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_roles_name_key UNIQUE (name)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;

-- Create new policy
CREATE POLICY "Admins can manage roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_role_assignment ON user_roles;
DROP FUNCTION IF EXISTS handle_role_assignment();

-- Create function to handle role assignments
CREATE OR REPLACE FUNCTION handle_role_assignment()
RETURNS trigger AS $$
BEGIN
  -- Update user's permissions in profile
  UPDATE profiles
  SET role = NEW.name
  WHERE id = auth.uid();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role assignments
CREATE TRIGGER on_role_assignment
  AFTER INSERT OR UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION handle_role_assignment();

-- Insert default roles if they don't exist
INSERT INTO user_roles (name, description, permissions)
SELECT 'individual', 'Individual user with basic permissions', jsonb_build_array(
  'create_content',
  'edit_own_content',
  'delete_own_content',
  'view_analytics'
)
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles WHERE name = 'individual'
);

INSERT INTO user_roles (name, description, permissions)
SELECT 'business', 'Business user with team management', jsonb_build_array(
  'create_content',
  'edit_own_content',
  'delete_own_content',
  'view_analytics',
  'invite_team_members',
  'manage_team_roles',
  'view_team_analytics'
)
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles WHERE name = 'business'
);

INSERT INTO user_roles (name, description, permissions)
SELECT 'agency', 'Agency with advanced permissions', jsonb_build_array(
  'create_content',
  'edit_own_content',
  'delete_own_content',
  'view_analytics',
  'invite_team_members',
  'manage_team_roles',
  'view_team_analytics',
  'manage_client_accounts',
  'white_label_reports',
  'api_access'
)
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles WHERE name = 'agency'
);

INSERT INTO user_roles (name, description, permissions)
SELECT 'admin', 'System administrator with full access', jsonb_build_array(
  'manage_users',
  'manage_roles',
  'manage_permissions',
  'view_system_logs',
  'manage_settings',
  'edit_any_content',
  'delete_any_content'
)
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles WHERE name = 'admin'
);