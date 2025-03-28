/*
  # Create content management tables

  1. New Tables
    - `content_items`
      - Core content table with versioning support
      - Supports multiple content types
      - Includes approval workflow
      - Tracks content history

    - `content_tags`
      - Tags for organizing content
      - Agency-specific tags

    - `content_item_tags`
      - Many-to-many relationship between content and tags

    - `content_approval_flows`
      - Approval workflow tracking
      - Multiple approvers support
      - Feedback history

    - `content_distribution`
      - Platform-specific content distribution
      - Publishing status tracking
      - Performance metrics

  2. Security
    - Enable RLS
    - Add policies for agency members
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Agency members can manage tags" ON content_tags;
    DROP POLICY IF EXISTS "Agency members can create content" ON content_items;
    DROP POLICY IF EXISTS "Agency members can update their content" ON content_items;
    DROP POLICY IF EXISTS "Agency members can view their content" ON content_items;
    DROP POLICY IF EXISTS "Content creators and approvers can access approval flows" ON content_approval_flows;
    DROP POLICY IF EXISTS "Agency members can manage content distribution" ON content_distribution;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- Create content_tags table
CREATE TABLE IF NOT EXISTS content_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agencies,
  name text NOT NULL,
  color text DEFAULT '#4C6FFF',
  created_at timestamptz DEFAULT now()
);

-- Create content_items table
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agencies,
  creator_id uuid REFERENCES profiles,
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'draft',
  platform text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  language text DEFAULT 'en'
);

-- Create content_item_tags table
CREATE TABLE IF NOT EXISTS content_item_tags (
  content_id uuid REFERENCES content_items ON DELETE CASCADE,
  tag_id uuid REFERENCES content_tags ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- Create content_approval_flows table
CREATE TABLE IF NOT EXISTS content_approval_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agencies,
  content_id uuid REFERENCES content_items ON DELETE CASCADE,
  status text DEFAULT 'pending',
  approvers uuid[],
  current_step integer DEFAULT 0,
  feedback text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content_distribution table
CREATE TABLE IF NOT EXISTS content_distribution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content_items ON DELETE CASCADE,
  platform text NOT NULL,
  status text DEFAULT 'pending',
  scheduled_time timestamptz,
  published_time timestamptz,
  platform_post_id text,
  metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_item_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_approval_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_distribution ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Agency members can manage tags"
  ON content_tags
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM agency_members
      WHERE agency_members.agency_id = content_tags.agency_id
      AND agency_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Agency members can create content"
  ON content_items
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agency_members
      WHERE agency_members.agency_id = content_items.agency_id
      AND agency_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Agency members can update their content"
  ON content_items
  FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM agency_members
      WHERE agency_members.agency_id = content_items.agency_id
      AND agency_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Agency members can view their content"
  ON content_items
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM agency_members
      WHERE agency_members.agency_id = content_items.agency_id
      AND agency_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Content creators and approvers can access approval flows"
  ON content_approval_flows
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agency_members
      WHERE agency_members.agency_id = content_approval_flows.agency_id
      AND agency_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Agency members can manage content distribution"
  ON content_distribution
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_items ci
      JOIN agency_members am ON am.agency_id = ci.agency_id
      WHERE ci.id = content_distribution.content_id
      AND am.user_id = auth.uid()
    )
  );

-- Drop existing functions and triggers if they exist
DROP TRIGGER IF EXISTS after_content_created ON content_items;
DROP FUNCTION IF EXISTS process_content_automation();
DROP TRIGGER IF EXISTS after_content_generation ON content_generations;
DROP FUNCTION IF EXISTS track_content_generation();

-- Create function to handle content automation
CREATE OR REPLACE FUNCTION process_content_automation()
RETURNS trigger AS $$
BEGIN
  -- Create approval flow for new content
  INSERT INTO content_approval_flows (
    agency_id,
    content_id,
    approvers
  )
  SELECT
    NEW.agency_id,
    NEW.id,
    ARRAY(
      SELECT user_id
      FROM agency_members
      WHERE agency_id = NEW.agency_id
      AND role = 'admin'
    );

  -- Notify approvers
  PERFORM pg_notify(
    'content_approval',
    json_build_object(
      'content_id', NEW.id,
      'agency_id', NEW.agency_id,
      'type', 'new_content'
    )::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for content automation
CREATE TRIGGER after_content_created
  AFTER INSERT ON content_items
  FOR EACH ROW
  EXECUTE FUNCTION process_content_automation();

-- Create function to track content generation
CREATE OR REPLACE FUNCTION track_content_generation()
RETURNS trigger AS $$
BEGIN
  -- Track usage
  INSERT INTO usage (
    user_id,
    type,
    amount,
    metadata
  )
  VALUES (
    auth.uid(),
    'content_generation',
    1,
    json_build_object(
      'content_id', NEW.id,
      'content_type', NEW.type,
      'language', NEW.language
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for content generation tracking
CREATE TRIGGER after_content_generation
  AFTER INSERT ON content_generations
  FOR EACH ROW
  EXECUTE FUNCTION track_content_generation();