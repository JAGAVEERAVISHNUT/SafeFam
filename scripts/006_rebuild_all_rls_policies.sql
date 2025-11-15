-- Drop ALL existing policies completely
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view families they created" ON families;
DROP POLICY IF EXISTS "Users can insert their own families" ON families;
DROP POLICY IF EXISTS "Users can update their own families" ON families;
DROP POLICY IF EXISTS "Users can delete their own families" ON families;
DROP POLICY IF EXISTS "Users can view family members in their families" ON family_members;
DROP POLICY IF EXISTS "Users can insert family members to their families" ON family_members;
DROP POLICY IF EXISTS "Users can update family members in their families" ON family_members;
DROP POLICY IF EXISTS "Users can delete family members from their families" ON family_members;
DROP POLICY IF EXISTS "Users can view medications for family members" ON medications;
DROP POLICY IF EXISTS "Users can insert medications for family members" ON medications;
DROP POLICY IF EXISTS "Users can update medications for family members" ON medications;
DROP POLICY IF EXISTS "Users can delete medications for family members" ON medications;
DROP POLICY IF EXISTS "Users can view medication logs" ON medication_logs;
DROP POLICY IF EXISTS "Users can insert medication logs" ON medication_logs;
DROP POLICY IF EXISTS "Users can view vaccinations" ON vaccinations;
DROP POLICY IF EXISTS "Users can insert vaccinations" ON vaccinations;
DROP POLICY IF EXISTS "Users can update vaccinations" ON vaccinations;
DROP POLICY IF EXISTS "Users can delete vaccinations" ON vaccinations;
DROP POLICY IF EXISTS "Users can view appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete appointments" ON appointments;
DROP POLICY IF EXISTS "Users can view health records" ON health_records;
DROP POLICY IF EXISTS "Users can insert health records" ON health_records;
DROP POLICY IF EXISTS "Users can update health records" ON health_records;
DROP POLICY IF EXISTS "Users can delete health records" ON health_records;

-- Create simple, non-recursive policies

-- Profiles: Users can only see and update their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Families: Users can only manage families they created
CREATE POLICY "Users can view their families"
  ON families FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Users can insert families"
  ON families FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their families"
  ON families FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their families"
  ON families FOR DELETE
  USING (creator_id = auth.uid());

-- Family Members: Simple policy - check if family belongs to user
-- This is the critical one that was causing recursion
CREATE POLICY "Users can view family members"
  ON family_members FOR SELECT
  USING (
    family_id IN (
      SELECT id FROM families WHERE creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert family members"
  ON family_members FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT id FROM families WHERE creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update family members"
  ON family_members FOR UPDATE
  USING (
    family_id IN (
      SELECT id FROM families WHERE creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete family members"
  ON family_members FOR DELETE
  USING (
    family_id IN (
      SELECT id FROM families WHERE creator_id = auth.uid()
    )
  );

-- Medications: Check if member belongs to user's family
CREATE POLICY "Users can view medications"
  ON medications FOR SELECT
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert medications"
  ON medications FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update medications"
  ON medications FOR UPDATE
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete medications"
  ON medications FOR DELETE
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

-- Medication Logs: Check if medication belongs to user's family
CREATE POLICY "Users can view medication logs"
  ON medication_logs FOR SELECT
  USING (
    medication_id IN (
      SELECT m.id FROM medications m
      JOIN family_members fm ON m.member_id = fm.id
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert medication logs"
  ON medication_logs FOR INSERT
  WITH CHECK (
    medication_id IN (
      SELECT m.id FROM medications m
      JOIN family_members fm ON m.member_id = fm.id
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

-- Vaccinations
CREATE POLICY "Users can view vaccinations"
  ON vaccinations FOR SELECT
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert vaccinations"
  ON vaccinations FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update vaccinations"
  ON vaccinations FOR UPDATE
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete vaccinations"
  ON vaccinations FOR DELETE
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

-- Appointments
CREATE POLICY "Users can view appointments"
  ON appointments FOR SELECT
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update appointments"
  ON appointments FOR UPDATE
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete appointments"
  ON appointments FOR DELETE
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

-- Health Records
CREATE POLICY "Users can view health records"
  ON health_records FOR SELECT
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert health records"
  ON health_records FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update health records"
  ON health_records FOR UPDATE
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete health records"
  ON health_records FOR DELETE
  USING (
    member_id IN (
      SELECT fm.id FROM family_members fm
      JOIN families f ON fm.family_id = f.id
      WHERE f.creator_id = auth.uid()
    )
  );
