/*
  # Update content scheduling tables

  1. Changes
    - Drop existing policy if it exists
    - Create content_schedules table if it doesn't exist
    - Add indexes for performance
    - Create function and trigger for scheduled content processing

  2. Security
    - Enable RLS
    - Add policies for agency members
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Agency members can manage schedules" ON content_schedules;

-- Create content_schedules table
CREATE TABLE IF NOT EXISTS content_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content_items,
  scheduled_time timestamptz NOT NULL,
  timezone text DEFAULT 'UTC',
  status text DEFAULT 'pending',
  retry_count integer DEFAULT 0,
  last_attempt timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Agency members can manage schedules"
  ON content_schedules
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM content_items ci
      JOIN agency_members ON agency_members.agency_id = ci.agency_id
      WHERE ci.id = content_schedules.content_id
      AND agency_members.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_schedules_time ON content_schedules (scheduled_time);
CREATE INDEX IF NOT EXISTS idx_content_schedules_status ON content_schedules (status);
CREATE INDEX IF NOT EXISTS idx_content_schedules_content ON content_schedules (content_id);

-- Create function to process scheduled content
CREATE OR REPLACE FUNCTION process_scheduled_content()
RETURNS trigger AS $$
BEGIN
  -- Update content status
  UPDATE content_items
  SET status = 'scheduled'
  WHERE id = NEW.content_id;
  
  -- Notify scheduling service
  PERFORM pg_notify(
    'content_schedule',
    json_build_object(
      'content_id', NEW.content_id,
      'scheduled_time', NEW.scheduled_time,
      'timezone', NEW.timezone
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for scheduled content
DROP TRIGGER IF EXISTS on_content_scheduled ON content_schedules;
CREATE TRIGGER on_content_scheduled
  AFTER INSERT ON content_schedules
  FOR EACH ROW
  EXECUTE FUNCTION process_scheduled_content();