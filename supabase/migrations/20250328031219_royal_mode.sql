-- Drop existing policies to prevent recursion
DROP POLICY IF EXISTS "Agency members can view their agencies" ON agencies;
DROP POLICY IF EXISTS "Agency admins can update their agency" ON agencies;
DROP POLICY IF EXISTS "Agency members can select agency" ON agency_members;

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