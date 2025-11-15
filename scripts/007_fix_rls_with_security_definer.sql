-- Drop all existing RLS policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view their families" ON families;
DROP POLICY IF EXISTS "Users can create families" ON families;
DROP POLICY IF EXISTS "Users can update their families" ON families;
DROP POLICY IF EXISTS "Users can delete their families" ON families;

DROP POLICY IF EXISTS "Users can view family members" ON family_members;
DROP POLICY IF EXISTS "Users can create family members" ON family_members;
DROP POLICY IF EXISTS "Users can update family members" ON family_members;
DROP POLICY IF EXISTS "Users can delete family members" ON family_members;

DROP POLICY IF EXISTS "Users can view medications" ON medications;
DROP POLICY IF EXISTS "Users can create medications" ON medications;
DROP POLICY IF EXISTS "Users can update medications" ON medications;
DROP POLICY IF EXISTS "Users can delete medications" ON medications;

DROP POLICY IF EXISTS "Users can view medication logs" ON medication_logs;
DROP POLICY IF EXISTS "Users can create medication logs" ON medication_logs;

DROP POLICY IF EXISTS "Users can view vaccinations" ON vaccinations;
DROP POLICY IF EXISTS "Users can create vaccinations" ON vaccinations;
DROP POLICY IF EXISTS "Users can update vaccinations" ON vaccinations;
DROP POLICY IF EXISTS "Users can delete vaccinations" ON vaccinations;

DROP POLICY IF EXISTS "Users can view appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete appointments" ON appointments;

DROP POLICY IF EXISTS "Users can view health records" ON health_records;
DROP POLICY IF EXISTS "Users can create health records" ON health_records;
DROP POLICY IF EXISTS "Users can update health records" ON health_records;
DROP POLICY IF EXISTS "Users can delete health records" ON health_records;

-- Create SECURITY DEFINER functions to bypass RLS for checking membership
-- These functions run with elevated privileges and don't trigger RLS policies

-- Function to check if a user is the creator of a family
CREATE OR REPLACE FUNCTION public.is_family_creator(family_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM families
    WHERE id = family_uuid
    AND created_by = user_uuid
  );
$$;

-- Function to check if a family member belongs to user's family
CREATE OR REPLACE FUNCTION public.is_family_member_in_users_family(member_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM family_members fm
    INNER JOIN families f ON fm.family_id = f.id
    WHERE fm.id = member_uuid
    AND f.created_by = user_uuid
  );
$$;

-- Function to get user's family IDs
CREATE OR REPLACE FUNCTION public.get_user_family_ids(user_uuid uuid)
RETURNS TABLE(family_id uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT id FROM families
  WHERE created_by = user_uuid;
$$;

-- Now create clean RLS policies using these functions

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Families policies (simple, no recursion)
CREATE POLICY "Users can view their families"
  ON families FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Users can create families"
  ON families FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their families"
  ON families FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their families"
  ON families FOR DELETE
  USING (created_by = auth.uid());

-- Family members policies using SECURITY DEFINER function
CREATE POLICY "Users can view family members"
  ON family_members FOR SELECT
  USING (
    family_id IN (SELECT get_user_family_ids(auth.uid()))
  );

CREATE POLICY "Users can create family members"
  ON family_members FOR INSERT
  WITH CHECK (
    is_family_creator(family_id, auth.uid())
  );

CREATE POLICY "Users can update family members"
  ON family_members FOR UPDATE
  USING (
    is_family_creator(family_id, auth.uid())
  );

CREATE POLICY "Users can delete family members"
  ON family_members FOR DELETE
  USING (
    is_family_creator(family_id, auth.uid())
  );

-- Medications policies
CREATE POLICY "Users can view medications"
  ON medications FOR SELECT
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can create medications"
  ON medications FOR INSERT
  WITH CHECK (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can update medications"
  ON medications FOR UPDATE
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can delete medications"
  ON medications FOR DELETE
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

-- Medication logs policies
CREATE POLICY "Users can view medication logs"
  ON medication_logs FOR SELECT
  USING (
    medication_id IN (
      SELECT id FROM medications
      WHERE is_family_member_in_users_family(family_member_id, auth.uid())
    )
  );

CREATE POLICY "Users can create medication logs"
  ON medication_logs FOR INSERT
  WITH CHECK (
    medication_id IN (
      SELECT id FROM medications
      WHERE is_family_member_in_users_family(family_member_id, auth.uid())
    )
  );

-- Vaccinations policies
CREATE POLICY "Users can view vaccinations"
  ON vaccinations FOR SELECT
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can create vaccinations"
  ON vaccinations FOR INSERT
  WITH CHECK (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can update vaccinations"
  ON vaccinations FOR UPDATE
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can delete vaccinations"
  ON vaccinations FOR DELETE
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

-- Appointments policies
CREATE POLICY "Users can view appointments"
  ON appointments FOR SELECT
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can update appointments"
  ON appointments FOR UPDATE
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can delete appointments"
  ON appointments FOR DELETE
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

-- Health records policies
CREATE POLICY "Users can view health records"
  ON health_records FOR SELECT
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can create health records"
  ON health_records FOR INSERT
  WITH CHECK (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can update health records"
  ON health_records FOR UPDATE
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );

CREATE POLICY "Users can delete health records"
  ON health_records FOR DELETE
  USING (
    is_family_member_in_users_family(family_member_id, auth.uid())
  );
