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

-- Create or update the profile
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@megarray.com';
  
  IF v_user_id IS NOT NULL THEN
    -- Update or insert the profile
    INSERT INTO profiles (
      id,
      email,
      first_name,
      last_name,
      role
    ) VALUES (
      v_user_id,
      'admin@megarray.com',
      'Hitesh',
      'Rawal',
      'super_admin'
    )
    ON CONFLICT (id) DO UPDATE SET
      first_name = 'Hitesh',
      last_name = 'Rawal',
      role = 'super_admin';

    -- Create or update admin user record
    INSERT INTO admin_users (
      user_id,
      role_id,
      is_active
    ) VALUES (
      v_user_id,
      (SELECT id FROM admin_roles WHERE name = 'super_admin'),
      true
    )
    ON CONFLICT (user_id) DO UPDATE SET
      role_id = (SELECT id FROM admin_roles WHERE name = 'super_admin'),
      is_active = true;
  END IF;
END $$;