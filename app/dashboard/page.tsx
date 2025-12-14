"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { QuickActions } from "@/components/quick-actions"
import { FamilyMembersGrid } from "@/components/family-members-grid"
import { UpcomingAppointments } from "@/components/upcoming-appointments"
import { MedicationReminders } from "@/components/medication-reminders"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

const DEMO_DATA = {
  user: { id: "demo-user", email: "demo@safefam.app" },
  family: { id: "demo-family", name: "Demo Family" },
  members: [
    {
      id: "1",
      full_name: "John Smith",
      relationship: "Self",
      date_of_birth: "1985-03-15",
      blood_type: "A+",
      is_primary_account: true,
    },
    {
      id: "2",
      full_name: "Jane Smith",
      relationship: "Spouse",
      date_of_birth: "1987-07-22",
      blood_type: "B+",
      is_primary_account: false,
    },
    {
      id: "3",
      full_name: "Emily Smith",
      relationship: "Daughter",
      date_of_birth: "2015-11-10",
      blood_type: "A+",
      is_primary_account: false,
    },
  ],
  appointments: [
    {
      id: "1",
      appointment_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      appointment_time: "10:00",
      type: "Check-up",
      doctor_name: "Dr. Johnson",
      location: "City Medical Center",
      family_members: { full_name: "Emily Smith" },
    },
    {
      id: "2",
      appointment_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      appointment_time: "14:30",
      type: "Dental",
      doctor_name: "Dr. Williams",
      location: "Smile Dentistry",
      family_members: { full_name: "Jane Smith" },
    },
  ],
  medications: [
    {
      id: "1",
      medication_name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timing: ["Morning"],
      family_members: { full_name: "John Smith" },
    },
    {
      id: "2",
      medication_name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Once daily",
      timing: ["Morning"],
      family_members: { full_name: "Jane Smith" },
    },
  ],
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(true) // Default to demo mode
  const [user, setUser] = useState<any>(DEMO_DATA.user)
  const [family, setFamily] = useState<any>(DEMO_DATA.family)
  const [members, setMembers] = useState<any[]>(DEMO_DATA.members)
  const [appointments, setAppointments] = useState<any[]>(DEMO_DATA.appointments)
  const [medications, setMedications] = useState<any[]>(DEMO_DATA.medications)

  useEffect(() => {
    const isPreviewMode = !process.env.NEXT_PUBLIC_KV_REST_API_URL

    if (isPreviewMode) {
      console.log("[v0] Preview mode detected, using demo data")
      setDemoMode(true)
      setLoading(false)
    } else {
      // TODO: Load real data from Redis when deployed
      console.log("[v0] Production mode - would load data from Redis")
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
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
              You're viewing SafeFam with demo data. Deploy this app with Upstash Redis to enable full functionality.
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
  )
}
