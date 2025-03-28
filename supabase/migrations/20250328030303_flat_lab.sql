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
      'Admin',
      'User',
      'super_admin'
    )
    ON CONFLICT (id) DO UPDATE SET
      first_name = 'Admin',
      last_name = 'User',
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

-- Create trigger function for new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'individual')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();