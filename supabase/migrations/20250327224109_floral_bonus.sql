/*
  # Add language support to user preferences and content

  1. Changes
    - Add language field to user_preferences
    - Add language field to content_items
    - Add language field to content_prompts
    - Add language field to content_templates

  2. Security
    - Maintain existing RLS policies
*/

-- Add language field to user_preferences if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_preferences' 
    AND column_name = 'language'
  ) THEN
    ALTER TABLE user_preferences 
    ADD COLUMN language text DEFAULT 'en';
  END IF;
END $$;

-- Add language field to content_items if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_items' 
    AND column_name = 'language'
  ) THEN
    ALTER TABLE content_items 
    ADD COLUMN language text DEFAULT 'en';
  END IF;
END $$;

-- Add language field to content_prompts if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_prompts' 
    AND column_name = 'language'
  ) THEN
    ALTER TABLE content_prompts 
    ADD COLUMN language text DEFAULT 'en';
  END IF;
END $$;

-- Add language field to content_templates if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_templates' 
    AND column_name = 'language'
  ) THEN
    ALTER TABLE content_templates 
    ADD COLUMN language text DEFAULT 'en';
  END IF;
END $$;

-- Create function to handle language preferences
CREATE OR REPLACE FUNCTION handle_language_preference()
RETURNS trigger AS $$
BEGIN
  -- Update user_preferences language when profile language changes
  IF TG_OP = 'UPDATE' AND NEW.language IS DISTINCT FROM OLD.language THEN
    UPDATE user_preferences
    SET language = NEW.language
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for language preference updates
DROP TRIGGER IF EXISTS on_profile_language_update ON profiles;
CREATE TRIGGER on_profile_language_update
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_language_preference();