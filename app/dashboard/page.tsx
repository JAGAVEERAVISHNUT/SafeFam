"use client"

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { MainNav } from "@/components/main-nav";
import { DashboardHeader } from "@/components/dashboard-header";
import { QuickActions } from "@/components/quick-actions";
import { FamilyMembersGrid } from "@/components/family-members-grid";
import { UpcomingAppointments } from "@/components/upcoming-appointments";
import { MedicationReminders } from "@/components/medication-reminders";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

const DEMO_DATA = {
  user: { id: "demo-user", email: "demo@safefam.app" },
  family: { id: "demo-family", name: "Demo Family" },
  members: [
    { id: "1", full_name: "John Smith", relationship: "Self", date_of_birth: "1985-03-15", blood_type: "A+", is_primary_account: true },
    { id: "2", full_name: "Jane Smith", relationship: "Spouse", date_of_birth: "1987-07-22", blood_type: "B+", is_primary_account: false },
    { id: "3", full_name: "Emily Smith", relationship: "Daughter", date_of_birth: "2015-11-10", blood_type: "A+", is_primary_account: false }
  ],
  appointments: [
    { id: "1", appointment_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), appointment_time: "10:00", type: "Check-up", doctor_name: "Dr. Johnson", location: "City Medical Center", family_members: { full_name: "Emily Smith" } },
    { id: "2", appointment_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), appointment_time: "14:30", type: "Dental", doctor_name: "Dr. Williams", location: "Smile Dentistry", family_members: { full_name: "Jane Smith" } }
  ],
  medications: [
    { id: "1", medication_name: "Lisinopril", dosage: "10mg", frequency: "Once daily", timing: ["Morning"], family_members: { full_name: "John Smith" } },
    { id: "2", medication_name: "Vitamin D", dosage: "1000 IU", frequency: "Once daily", timing: ["Morning"], family_members: { full_name: "Jane Smith" } }
  ]
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [family, setFamily] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  
  useEffect(() => {
    async function loadDashboard() {
      try {
        const supabase = createClient();
        
        const authPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 5000)
        );
        
        const authResponse = await Promise.race([authPromise, timeoutPromise]) as any;
        
        if (authResponse.error || !authResponse.data?.user) {
          console.log("[v0] No authenticated user, redirecting to login");
          router.push("/auth/login");
          return;
        }
        
        const authUser = authResponse.data.user;
        setUser(authUser);

        // Get user's family member record
        const { data: userMember, error: memberError } = await supabase
          .from("family_members")
          .select("family_id, id")
          .eq("profile_id", authUser.id)
          .maybeSingle();

        if (memberError) throw memberError;

        if (!userMember) {
          router.push("/onboarding");
          return;
        }

        // Get family details
        const { data: familyData, error: familyError } = await supabase
          .from("families")
          .select("*")
          .eq("id", userMember.family_id)
          .maybeSingle();
        
        if (familyError) throw familyError;
        setFamily(familyData);

        // Get all family members
        const { data: membersData, error: membersError } = await supabase
          .from("family_members")
          .select("*")
          .eq("family_id", userMember.family_id)
          .order("is_primary_account", { ascending: false });
        
        if (membersError) throw membersError;
        setMembers(membersData || []);

        // Get upcoming appointments (next 7 days)
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const { data: appointmentsData } = await supabase
          .from("appointments")
          .select(`
            *,
            family_members!inner(full_name)
          `)
          .in("family_member_id", membersData?.map(m => m.id) || [])
          .eq("status", "scheduled")
          .gte("appointment_date", today.toISOString())
          .lte("appointment_date", nextWeek.toISOString())
          .order("appointment_date", { ascending: true })
          .limit(5);
        
        setAppointments(appointmentsData || []);

        // Get today's medications
        const { data: medicationsData } = await supabase
          .from("medications")
          .select(`
            *,
            family_members!inner(full_name)
          `)
          .in("family_member_id", membersData?.map(m => m.id) || [])
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(5);
        
        setMedications(medicationsData || []);
        setLoading(false);
        
      } catch (error: any) {
        console.log("[v0] Error loading dashboard:", error?.message || error);
        console.log("[v0] Enabling demo mode - Supabase unavailable");
        
        setDemoMode(true);
        setUser(DEMO_DATA.user);
        setFamily(DEMO_DATA.family);
        setMembers(DEMO_DATA.members);
        setAppointments(DEMO_DATA.appointments);
        setMedications(DEMO_DATA.medications);
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <MainNav />
      
      {demoMode && (
        <div className="container mx-auto px-4 pt-6 max-w-7xl">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Preview Mode</AlertTitle>
            <AlertDescription>
              You're viewing SafeFam with demo data. Deploy this app to connect to a real Supabase database.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <DashboardHeader familyName={family?.name || "My Family"} userName={user?.email || ""} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <QuickActions familyId={family?.id} />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <div className="lg:col-span-2">
            <FamilyMembersGrid members={members} />
          </div>
          
          <div className="space-y-6">
            <UpcomingAppointments appointments={appointments} />
            <MedicationReminders medications={medications} />
          </div>
        </div>
      </div>
    </div>
  );
}
