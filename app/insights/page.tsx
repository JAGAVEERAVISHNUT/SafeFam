import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { TrendingUp, Pill, Calendar, Syringe, FileText } from 'lucide-react';

export default async function InsightsPage() {
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
    .eq("family_id", userMember.family_id);

  const memberIds = members?.map(m => m.id) || [];

  // Get statistics
  const { count: medicationCount } = await supabase
    .from("medications")
    .select("*", { count: 'exact', head: true })
    .in("family_member_id", memberIds)
    .eq("is_active", true);

  const { count: appointmentCount } = await supabase
    .from("appointments")
    .select("*", { count: 'exact', head: true })
    .in("family_member_id", memberIds)
    .eq("status", "scheduled")
    .gte("appointment_date", new Date().toISOString());

  const { count: vaccinationCount } = await supabase
    .from("vaccinations")
    .select("*", { count: 'exact', head: true })
    .in("family_member_id", memberIds);

  const { count: recordCount } = await supabase
    .from("health_records")
    .select("*", { count: 'exact', head: true })
    .in("family_member_id", memberIds);

  return (
    <div className="min-h-screen bg-muted/30">
      <MainNav />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Health Insights</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your family&apos;s health data
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{medicationCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently being taken
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointmentCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Scheduled ahead
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Vaccinations</CardTitle>
              <Syringe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vaccinationCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Records on file
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Health Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recordCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Documents stored
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Family Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members?.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{member.full_name}</p>
                    {member.relationship && (
                      <p className="text-sm text-muted-foreground">{member.relationship}</p>
                    )}
                  </div>
                  <Link href={`/member/${member.id}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
