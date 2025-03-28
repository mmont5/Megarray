/*
  # Create superadmin role and initial setup

  1. Changes
    - Create super_admin role if it doesn't exist
    - Set up initial admin role permissions
    - Create function to handle admin user creation
    - Set up trigger for admin user management

  2. Security
    - Ensure proper role assignment
    - Set up initial admin access
*/

-- First, ensure the super_admin role exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM admin_roles WHERE name = 'super_admin'
  ) THEN
    INSERT INTO admin_roles (name, permissions) VALUES (
      'super_admin',
      ARRAY[
        'manage_users',
        'manage_admins',
        'manage_roles',
        'manage_content',
        'manage_settings',
        'view_analytics',
        'manage_billing'
      ]
    );
  END IF;
END $$;

-- Create function to handle admin user creation
CREATE OR REPLACE FUNCTION handle_admin_user_creation()
RETURNS trigger AS $$
DECLARE
  _role_id uuid;
BEGIN
  -- Get the super_admin role id
  SELECT id INTO _role_id FROM admin_roles WHERE name = 'super_admin';
  
  -- Create admin user record if email matches
  IF NEW.email = 'admin@megarray.com' THEN
    INSERT INTO admin_users (user_id, role_id, is_active)
    VALUES (NEW.id, _role_id, true)
    ON CONFLICT (user_id) DO UPDATE
    SET is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for admin user creation
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_admin_user_creation();

-- Create function to handle profile creation for admin
CREATE OR REPLACE FUNCTION handle_admin_profile_creation()
RETURNS trigger AS $$
BEGIN
  -- Create profile for admin user
  IF NEW.email = 'admin@megarray.com' THEN
    INSERT INTO profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'super_admin')
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for admin profile creation
DROP TRIGGER IF EXISTS on_auth_user_created_admin_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_admin_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_admin_profile_creation();