import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { MainNav } from "@/components/main-nav";
import { VaccinationsList } from "@/components/vaccinations-list";
import { AddVaccinationButton } from "@/components/add-vaccination-button";

export default async function VaccinationsPage() {
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

  const { data: members } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", userMember.family_id)
    .order("full_name");

  const { data: vaccinations } = await supabase
    .from("vaccinations")
    .select(`
      *,
      family_members!inner(full_name)
    `)
    .in("family_member_id", members?.map(m => m.id) || [])
    .order("date_administered", { ascending: false });

  return (
    <div className="min-h-screen bg-muted/30">
      <MainNav />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Vaccinations</h1>
            <p className="text-muted-foreground mt-1">
              Track vaccination records for your family
            </p>
          </div>
          <AddVaccinationButton members={members || []} />
        </div>

        <VaccinationsList vaccinations={vaccinations || []} members={members || []} />
      </div>
    </div>
  );
}
