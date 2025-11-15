import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AppointmentWithMember {
  id: string;
  title: string;
  appointment_date: string;
  doctor_name: string | null;
  location: string | null;
  family_members: {
    full_name: string;
  };
}

interface UpcomingAppointmentsProps {
  appointments: AppointmentWithMember[];
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Appointments</CardTitle>
        <Link href="/appointments">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No upcoming appointments
          </p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex gap-3 p-3 rounded-lg border"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{appointment.title}</p>
                  <p className="text-xs text-muted-foreground">{appointment.family_members.full_name}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(appointment.appointment_date).toLocaleString()}</span>
                  </div>
                  {appointment.location && (
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{appointment.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
