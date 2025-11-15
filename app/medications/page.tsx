import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { MainNav } from "@/components/main-nav";
import { MedicationsList } from "@/components/medications-list";
import { AddMedicationButton } from "@/components/add-medication-button";

export default async function MedicationsPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: userMember } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!userMember) {
    redirect("/onboarding");
  }

  // Get all family members
  const { data: members } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", userMember.family_id)
    .order("full_name");

  // Get all medications
  const { data: medications } = await supabase
    .from("medications")
    .select(`
      *,
      family_members!inner(full_name)
    `)
    .in("family_member_id", members?.map(m => m.id) || [])
    .order("is_active", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-muted/30">
      <MainNav />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Medications</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage medications for your family
            </p>
          </div>
          <AddMedicationButton members={members || []} />
        </div>

        <MedicationsList medications={medications || []} members={members || []} />
      </div>
    </div>
  );
}
