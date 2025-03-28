/*
  # Create superadmin account

  1. Create initial superadmin user
    - Email: admin@megarray.com
    - Role: super_admin
    - Initial password will be set through auth.users

  2. Security
    - Ensures super_admin role exists
    - Creates profile and admin user records
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

-- Create the profile if it doesn't exist
INSERT INTO profiles (id, email, role)
SELECT 
  auth.uid(),
  'admin@megarray.com',
  'super_admin'
FROM auth.users
WHERE email = 'admin@megarray.com'
ON CONFLICT (id) DO NOTHING;

-- Create admin user record
INSERT INTO admin_users (user_id, role_id, is_active)
SELECT 
  auth.uid(),
  (SELECT id FROM admin_roles WHERE name = 'super_admin'),
  true
FROM auth.users
WHERE email = 'admin@megarray.com'
ON CONFLICT (id) DO NOTHING;