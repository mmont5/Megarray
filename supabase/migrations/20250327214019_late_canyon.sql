/*
  # Create admin system tables and initial superadmin

  1. New Tables
    - `admin_roles`
      - `id` (uuid, primary key)
      - `name` (text) - Role name (super_admin, admin, moderator)
      - `permissions` (text[]) - List of permissions
      - `created_at` (timestamptz)

    - `admin_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role_id` (uuid, references admin_roles)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  permissions text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role_id uuid REFERENCES admin_roles NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin roles are viewable by authenticated admins"
  ON admin_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND is_active = true
    )
  );

CREATE POLICY "Admin users are viewable by authenticated admins"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      INNER JOIN admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid()
      AND au.is_active = true
      AND ar.name = 'super_admin'
    )
  );

-- Insert default roles
INSERT INTO admin_roles (name, permissions) VALUES
  ('super_admin', ARRAY[
    'manage_users',
    'manage_admins',
    'manage_roles',
    'manage_content',
    'manage_settings',
    'view_analytics',
    'manage_billing'
  ]),
  ('admin', ARRAY[
    'manage_users',
    'manage_content',
    'view_analytics'
  ]),
  ('moderator', ARRAY[
    'manage_content',
    'view_analytics'
  ]);