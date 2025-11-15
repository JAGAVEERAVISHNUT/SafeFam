-- Drop ALL existing family_members policies to start fresh
DROP POLICY IF EXISTS "Users can view family members in their families" ON public.family_members;
DROP POLICY IF EXISTS "Users can add members to their families" ON public.family_members;
DROP POLICY IF EXISTS "Users can update family members in their families" ON public.family_members;
DROP POLICY IF EXISTS "Users can delete family members in their families" ON public.family_members;

-- Create simple, non-recursive policies
-- Users can only see/manage family members in families they created
CREATE POLICY "family_members_select_policy"
  ON public.family_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );

CREATE POLICY "family_members_insert_policy"
  ON public.family_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_id
      AND families.created_by = auth.uid()
    )
  );

CREATE POLICY "family_members_update_policy"
  ON public.family_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_id
      AND families.created_by = auth.uid()
    )
  );

CREATE POLICY "family_members_delete_policy"
  ON public.family_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );
