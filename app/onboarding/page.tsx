import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Check if user already has a family
  const { data: familyMembers } = await supabase
    .from("family_members")
    .select("id")
    .eq("profile_id", user.id)
    .limit(1);

  if (familyMembers && familyMembers.length > 0) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome to SafeFam</h1>
          <p className="text-muted-foreground">Let&apos;s set up your family profile</p>
        </div>
        <OnboardingForm userId={user.id} />
      </div>
    </div>
  );
}
