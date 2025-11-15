-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view family members in their families" ON public.family_members;
DROP POLICY IF EXISTS "Users can add members to their families" ON public.family_members;
DROP POLICY IF EXISTS "Users can update family members in their families" ON public.family_members;
DROP POLICY IF EXISTS "Users can delete family members in their families" ON public.family_members;

-- Recreate family_members policies without recursion
-- For SELECT: Allow users to see family members if they created the family OR if the family member is themselves
CREATE POLICY "Users can view family members in their families"
  ON public.family_members FOR SELECT
  USING (
    profile_id = auth.uid() 
    OR 
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );

-- For INSERT: Only family creators can add members
CREATE POLICY "Users can add members to their families"
  ON public.family_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );

-- For UPDATE: Only family creators can update members
CREATE POLICY "Users can update family members in their families"
  ON public.family_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );

-- For DELETE: Only family creators can delete members
CREATE POLICY "Users can delete family members in their families"
  ON public.family_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );
