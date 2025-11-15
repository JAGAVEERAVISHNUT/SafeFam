import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Phone, AlertCircle, Droplet, Activity, FileText, User } from 'lucide-react';

export default async function EmergencyPage() {
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
    .order("is_primary_account", { ascending: false });

  return (
    <div className="min-h-screen bg-destructive/5">
      <MainNav />
      <div className="bg-destructive text-destructive-foreground py-4">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Emergency Information</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="mb-8 border-destructive">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="text-destructive flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <a href="tel:911">
                <Button variant="destructive" size="lg" className="w-full h-20 text-xl">
                  <Phone className="h-6 w-6 mr-3" />
                  Call 911
                </Button>
              </a>
              <a href="tel:988">
                <Button variant="outline" size="lg" className="w-full h-20">
                  <Phone className="h-6 w-6 mr-3" />
                  Suicide Hotline
                  <span className="text-sm block mt-1">988</span>
                </Button>
              </a>
              <a href="tel:1-800-222-1222">
                <Button variant="outline" size="lg" className="w-full h-20">
                  <Phone className="h-6 w-6 mr-3" />
                  Poison Control
                  <span className="text-sm block mt-1">1-800-222-1222</span>
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {members?.map((member) => (
            <Card key={member.id} className="border-2">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {member.full_name}
                  {member.is_primary_account && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-2">
                      Primary
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {member.date_of_birth && (
                  <div className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Date of Birth</p>
                      <p className="text-muted-foreground">
                        {new Date(member.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {member.blood_type && (
                  <div className="flex items-start gap-3">
                    <Droplet className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Blood Type</p>
                      <p className="text-lg font-bold text-red-600">{member.blood_type}</p>
                    </div>
                  </div>
                )}

                {member.allergies && member.allergies.length > 0 && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium mb-2">Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {member.allergies.map((allergy, idx) => (
                          <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-lg font-medium">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {member.chronic_conditions && member.chronic_conditions.length > 0 && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium mb-2">Chronic Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {member.chronic_conditions.map((condition, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg font-medium">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {(member.emergency_contact || member.emergency_phone) && (
                  <div className="pt-4 border-t mt-4">
                    <p className="font-medium mb-2">Emergency Contact</p>
                    {member.emergency_contact && (
                      <p className="text-muted-foreground">{member.emergency_contact}</p>
                    )}
                    {member.emergency_phone && (
                      <a href={`tel:${member.emergency_phone}`} className="inline-block mt-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          {member.emergency_phone}
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
