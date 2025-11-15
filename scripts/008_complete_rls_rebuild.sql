-- Complete RLS rebuild to fix infinite recursion
-- This script drops ALL policies and creates simple, non-recursive ones

-- Drop ALL existing policies on all tables
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- ============================================
-- PROFILES TABLE POLICIES (No dependencies)
-- ============================================

CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ============================================
-- FAMILIES TABLE POLICIES (No dependencies)
-- ============================================

-- Key: These policies ONLY check created_by, no joins to other tables
CREATE POLICY "families_select_own"
ON families FOR SELECT
TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "families_insert_own"
ON families FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

CREATE POLICY "families_update_own"
ON families FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "families_delete_own"
ON families FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- ============================================
-- FAMILY_MEMBERS TABLE POLICIES
-- ============================================

-- Key: These use a subquery to families table only
-- The subquery is simple and doesn't trigger recursion because:
-- 1. It only queries families table
-- 2. families policies don't reference family_members
CREATE POLICY "family_members_select"
ON family_members FOR SELECT
TO authenticated
USING (
    family_id IN (
        SELECT id FROM families WHERE created_by = auth.uid()
    )
);

CREATE POLICY "family_members_insert"
ON family_members FOR INSERT
TO authenticated
WITH CHECK (
    family_id IN (
        SELECT id FROM families WHERE created_by = auth.uid()
    )
);

CREATE POLICY "family_members_update"
ON family_members FOR UPDATE
TO authenticated
USING (
    family_id IN (
        SELECT id FROM families WHERE created_by = auth.uid()
    )
)
WITH CHECK (
    family_id IN (
        SELECT id FROM families WHERE created_by = auth.uid()
    )
);

CREATE POLICY "family_members_delete"
ON family_members FOR DELETE
TO authenticated
USING (
    family_id IN (
        SELECT id FROM families WHERE created_by = auth.uid()
    )
);

-- ============================================
-- MEDICATIONS TABLE POLICIES
-- ============================================

CREATE POLICY "medications_select"
ON medications FOR SELECT
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "medications_insert"
ON medications FOR INSERT
TO authenticated
WITH CHECK (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "medications_update"
ON medications FOR UPDATE
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
)
WITH CHECK (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "medications_delete"
ON medications FOR DELETE
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

-- ============================================
-- MEDICATION_LOGS TABLE POLICIES
-- ============================================

CREATE POLICY "medication_logs_select"
ON medication_logs FOR SELECT
TO authenticated
USING (
    medication_id IN (
        SELECT m.id FROM medications m
        WHERE m.family_member_id IN (
            SELECT fm.id FROM family_members fm
            WHERE fm.family_id IN (
                SELECT id FROM families WHERE created_by = auth.uid()
            )
        )
    )
);

CREATE POLICY "medication_logs_insert"
ON medication_logs FOR INSERT
TO authenticated
WITH CHECK (
    medication_id IN (
        SELECT m.id FROM medications m
        WHERE m.family_member_id IN (
            SELECT fm.id FROM family_members fm
            WHERE fm.family_id IN (
                SELECT id FROM families WHERE created_by = auth.uid()
            )
        )
    )
);

CREATE POLICY "medication_logs_update"
ON medication_logs FOR UPDATE
TO authenticated
USING (
    medication_id IN (
        SELECT m.id FROM medications m
        WHERE m.family_member_id IN (
            SELECT fm.id FROM family_members fm
            WHERE fm.family_id IN (
                SELECT id FROM families WHERE created_by = auth.uid()
            )
        )
    )
)
WITH CHECK (
    medication_id IN (
        SELECT m.id FROM medications m
        WHERE m.family_member_id IN (
            SELECT fm.id FROM family_members fm
            WHERE fm.family_id IN (
                SELECT id FROM families WHERE created_by = auth.uid()
            )
        )
    )
);

-- ============================================
-- VACCINATIONS TABLE POLICIES
-- ============================================

CREATE POLICY "vaccinations_select"
ON vaccinations FOR SELECT
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "vaccinations_insert"
ON vaccinations FOR INSERT
TO authenticated
WITH CHECK (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "vaccinations_update"
ON vaccinations FOR UPDATE
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
)
WITH CHECK (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "vaccinations_delete"
ON vaccinations FOR DELETE
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

-- ============================================
-- APPOINTMENTS TABLE POLICIES
-- ============================================

CREATE POLICY "appointments_select"
ON appointments FOR SELECT
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "appointments_insert"
ON appointments FOR INSERT
TO authenticated
WITH CHECK (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "appointments_update"
ON appointments FOR UPDATE
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
)
WITH CHECK (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "appointments_delete"
ON appointments FOR DELETE
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

-- ============================================
-- HEALTH_RECORDS TABLE POLICIES
-- ============================================

CREATE POLICY "health_records_select"
ON health_records FOR SELECT
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "health_records_insert"
ON health_records FOR INSERT
TO authenticated
WITH CHECK (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "health_records_update"
ON health_records FOR UPDATE
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
)
WITH CHECK (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);

CREATE POLICY "health_records_delete"
ON health_records FOR DELETE
TO authenticated
USING (
    family_member_id IN (
        SELECT fm.id FROM family_members fm
        WHERE fm.family_id IN (
            SELECT id FROM families WHERE created_by = auth.uid()
        )
    )
);
