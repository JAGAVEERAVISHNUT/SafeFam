import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { MainNav } from "@/components/main-nav";
import { FamilyMembersList } from "@/components/family-members-list";
import { AddFamilyMemberButton } from "@/components/add-family-member-button";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';

export default async function FamilyPage() {
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

  // Get family details
  const { data: family } = await supabase
    .from("families")
    .select("*")
    .eq("id", userMember.family_id)
    .maybeSingle();

  // Get all family members
  const { data: members } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", userMember.family_id)
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-muted/30">
      <MainNav />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">{family?.name}</h1>
            <p className="text-muted-foreground mt-1">
              Manage your family members and their health information
            </p>
          </div>
          <AddFamilyMemberButton familyId={userMember.family_id} />
        </div>

        <FamilyMembersList members={members || []} familyId={userMember.family_id} />
      </div>
    </div>
  );
}
