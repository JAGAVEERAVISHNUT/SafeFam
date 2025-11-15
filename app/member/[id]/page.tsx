import { redirect, notFound } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { User, Calendar, Droplet, Phone, AlertTriangle, Activity } from 'lucide-react';

interface MemberPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: member } = await supabase
    .from("family_members")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!member) {
    notFound();
  }

  // Verify user has access to this family member
  const { data: userMember } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!userMember || userMember.family_id !== member.family_id) {
    notFound();
  }

  // Get medications
  const { data: medications } = await supabase
    .from("medications")
    .select("*")
    .eq("family_member_id", id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Get upcoming appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("family_member_id", id)
    .eq("status", "scheduled")
    .gte("appointment_date", new Date().toISOString())
    .order("appointment_date", { ascending: true })
    .limit(5);

  // Get vaccinations
  const { data: vaccinations } = await supabase
    .from("vaccinations")
    .select("*")
    .eq("family_member_id", id)
    .order("date_administered", { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-muted/30">
      <MainNav />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4 pb-4 border-b">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{member.full_name}</h2>
                  {member.relationship && (
                    <p className="text-sm text-muted-foreground">{member.relationship}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {member.date_of_birth && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(member.date_of_birth).toLocaleDateString()}</span>
                  </div>
                )}
                {member.blood_type && (
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-muted-foreground" />
                    <span>Blood Type: {member.blood_type}</span>
                  </div>
                )}
                {member.emergency_contact && (
                  <div className="pt-3 border-t">
                    <p className="font-medium mb-2">Emergency Contact</p>
                    <p className="text-muted-foreground">{member.emergency_contact}</p>
                    {member.emergency_phone && (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{member.emergency_phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {member.allergies && member.allergies.length > 0 && (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <p className="font-medium text-sm">Allergies</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.allergies.map((allergy, idx) => (
                      <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {member.chronic_conditions && member.chronic_conditions.length > 0 && (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-orange-600" />
                    <p className="font-medium text-sm">Chronic Conditions</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.chronic_conditions.map((condition, idx) => (
                      <span key={idx} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Active Medications</CardTitle>
                <Link href="/medications">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {!medications || medications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No active medications
                  </p>
                ) : (
                  <div className="space-y-3">
                    {medications.map((med) => (
                      <div key={med.id} className="p-3 rounded-lg border">
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Appointments</CardTitle>
                <Link href="/appointments">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {!appointments || appointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No upcoming appointments
                  </p>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="p-3 rounded-lg border">
                        <p className="font-medium">{apt.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(apt.appointment_date).toLocaleString()}
                        </p>
                        {apt.doctor_name && (
                          <p className="text-sm text-muted-foreground">Dr. {apt.doctor_name}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Vaccination History</CardTitle>
                <Link href="/vaccinations">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {!vaccinations || vaccinations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No vaccination records
                  </p>
                ) : (
                  <div className="space-y-3">
                    {vaccinations.map((vac) => (
                      <div key={vac.id} className="p-3 rounded-lg border">
                        <p className="font-medium">{vac.vaccine_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(vac.date_administered).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
