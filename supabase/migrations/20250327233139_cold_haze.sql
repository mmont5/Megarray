/*
  # Create content analytics table

  1. New Table
    - `content_analytics`
      - Tracks content performance metrics
      - Stores analytics data by platform and agency
      - Includes performance optimization indexes

  2. Security
    - Enable RLS
    - Add policy for agency members
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "select_analytics" ON content_analytics;
DROP POLICY IF EXISTS "agency_members_select_analytics" ON content_analytics;

-- Create content_analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS content_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content_items ON DELETE CASCADE,
  metric_type text NOT NULL,
  value numeric NOT NULL,
  recorded_at timestamptz DEFAULT now(),
  platform text,
  agency_id uuid REFERENCES agencies
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_analytics_agency ON content_analytics (agency_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_metrics ON content_analytics (agency_id, metric_type, recorded_at);
CREATE INDEX IF NOT EXISTS idx_content_analytics_platform ON content_analytics (platform);
CREATE INDEX IF NOT EXISTS idx_content_analytics_agency_platform ON content_analytics (agency_id, platform);
CREATE INDEX IF NOT EXISTS idx_content_analytics_agency_metrics ON content_analytics (agency_id, metric_type, recorded_at);
CREATE INDEX IF NOT EXISTS idx_content_analytics_lookup ON content_analytics (agency_id, platform, metric_type);

-- Enable RLS
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;

-- Create new policy
CREATE POLICY "agency_members_select_analytics"
  ON content_analytics
  FOR SELECT
  TO public
  USING (
    agency_id IN (
      SELECT am.agency_id
      FROM agency_members am
      WHERE am.user_id = auth.uid()
    )
  );