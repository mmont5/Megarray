/*
  # Create user roles and permissions system

  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `name` (text) - Role name
      - `description` (text)
      - `permissions` (jsonb) - List of permissions
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for admins
*/

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  permissions jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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