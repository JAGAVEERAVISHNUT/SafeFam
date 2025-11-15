-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Families policies
CREATE POLICY "Users can view families they belong to"
  ON public.families FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.family_id = families.id
      AND family_members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can create families"
  ON public.families FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Family creators can update their families"
  ON public.families FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Family creators can delete their families"
  ON public.families FOR DELETE
  USING (auth.uid() = created_by);

-- Family members policies
CREATE POLICY "Users can view family members in their families"
  ON public.family_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members AS fm
      WHERE fm.family_id = family_members.family_id
      AND fm.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can add members to their families"
  ON public.family_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update family members in their families"
  ON public.family_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete family members in their families"
  ON public.family_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );

-- Medications policies
CREATE POLICY "Users can view medications for family members in their families"
  ON public.medications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = medications.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can add medications for family members in their families"
  ON public.medications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = medications.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update medications for family members in their families"
  ON public.medications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = medications.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete medications for family members in their families"
  ON public.medications FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = medications.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

-- Medication logs policies (similar pattern to medications)
CREATE POLICY "Users can view medication logs"
  ON public.medication_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.medications
      JOIN public.family_members ON family_members.id = medications.family_member_id
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE medications.id = medication_logs.medication_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can add medication logs"
  ON public.medication_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.medications
      JOIN public.family_members ON family_members.id = medications.family_member_id
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE medications.id = medication_logs.medication_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update medication logs"
  ON public.medication_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.medications
      JOIN public.family_members ON family_members.id = medications.family_member_id
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE medications.id = medication_logs.medication_id
      AND my_family.profile_id = auth.uid()
    )
  );

-- Vaccinations policies
CREATE POLICY "Users can view vaccinations"
  ON public.vaccinations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = vaccinations.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can add vaccinations"
  ON public.vaccinations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = vaccinations.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update vaccinations"
  ON public.vaccinations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = vaccinations.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete vaccinations"
  ON public.vaccinations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = vaccinations.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

-- Appointments policies
CREATE POLICY "Users can view appointments"
  ON public.appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = appointments.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can add appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = appointments.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update appointments"
  ON public.appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = appointments.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete appointments"
  ON public.appointments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = appointments.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

-- Health records policies
CREATE POLICY "Users can view health records"
  ON public.health_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = health_records.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can add health records"
  ON public.health_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = health_records.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update health records"
  ON public.health_records FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = health_records.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete health records"
  ON public.health_records FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.family_members AS my_family ON my_family.family_id = family_members.family_id
      WHERE family_members.id = health_records.family_member_id
      AND my_family.profile_id = auth.uid()
    )
  );
