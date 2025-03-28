-- Update admin email
UPDATE auth.users 
SET email = 'mmont5@hotmail.com',
    email_confirmed_at = now(),
    updated_at = now()
WHERE email = 'admin@megarray.com';

UPDATE profiles
SET email = 'mmont5@hotmail.com'
WHERE email = 'admin@megarray.com';