-- Drop existing policies to prevent recursion
DROP POLICY IF EXISTS "Agency members can view their agencies" ON agencies;
DROP POLICY IF EXISTS "Agency admins can update their agency" ON agencies;
DROP POLICY IF EXISTS "Agency members can select agency" ON agency_members;
DROP POLICY IF EXISTS "Agency members can manage content" ON content_items;
DROP POLICY IF EXISTS "Agency members can view analytics" ON content_analytics;

-- Create new non-recursive policies
CREATE POLICY "Agency members can view their agencies"
  ON agencies
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM agency_members
      WHERE agency_members.agency_id = agencies.id
      AND agency_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Agency admins can update their agency"
  ON agencies
  FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM agency_members
      WHERE agency_members.agency_id = agencies.id
      AND agency_members.user_id = auth.uid()
      AND agency_members.role = 'admin'
    )
  );

CREATE POLICY "Agency members can select agency"
  ON agency_members
  FOR SELECT
  TO public
  USING (
    user_id = auth.uid()
  );

CREATE POLICY "Agency members can manage content"
  ON content_items
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM agency_members
      WHERE agency_members.agency_id = content_items.agency_id
      AND agency_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Agency members can view analytics"
  ON content_analytics
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM agency_members
      WHERE agency_members.agency_id = content_analytics.agency_id
      AND agency_members.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agency_members_user_agency ON agency_members(user_id, agency_id);
CREATE INDEX IF NOT EXISTS idx_content_items_agency ON content_items(agency_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_agency ON content_analytics(agency_id);