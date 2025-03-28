-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create or replace the handle_new_user function
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
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'individual')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', profiles.first_name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', profiles.last_name),
    role = COALESCE(NEW.raw_user_meta_data->>'role', profiles.role);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update existing profiles to ensure they have first_name
UPDATE profiles
SET first_name = split_part(email, '@', 1)
WHERE first_name IS NULL;