"use client";

import { Appointment } from "@/lib/types/database";
import { FamilyMember } from "@/lib/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin, FileText, Edit, Trash2 } from 'lucide-react';
import { useState } from "react";
import { EditAppointmentDialog } from "@/components/edit-appointment-dialog";
import { DeleteAppointmentDialog } from "@/components/delete-appointment-dialog";

interface AppointmentWithMember extends Appointment {
  family_members: {
    full_name: string;
  };
}

interface AppointmentsListProps {
  appointments: AppointmentWithMember[];
  members: FamilyMember[];
}

export function AppointmentsList({ appointments, members }: AppointmentsListProps) {
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithMember | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<AppointmentWithMember | null>(null);

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    a => new Date(a.appointment_date) >= now && a.status === "scheduled"
  );
  const pastAppointments = appointments.filter(
    a => new Date(a.appointment_date) < now || a.status !== "scheduled"
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="default" className="bg-green-500">Scheduled</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const formatAppointmentDateTime = (dateTimeString: string) => {
    const [datePart, timePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dateString = date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const hour = parseInt(hours);
    const isPM = hour >= 12;
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const timeString = `${displayHour}:${minutes} ${isPM ? 'PM' : 'AM'}`;
    
    return { dateString, timeString };
  };

  const AppointmentCard = ({ appointment }: { appointment: AppointmentWithMember }) => {
    const { dateString, timeString } = formatAppointmentDateTime(appointment.appointment_date);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg truncate">{appointment.title}</h3>
                  {getStatusBadge(appointment.status)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{appointment.family_members.full_name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <p><span className="font-medium">Type:</span> {appointment.appointment_type}</p>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{dateString}</span>
              <Clock className="h-4 w-4 text-muted-foreground ml-2" />
              <span>{timeString}</span>
            </div>

            {appointment.doctor_name && (
              <p className="text-muted-foreground">
                <span className="font-medium">Doctor:</span> Dr. {appointment.doctor_name}
              </p>
            )}

            {appointment.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{appointment.location}</span>
              </div>
            )}

            {appointment.notes && (
              <div className="flex items-start gap-2 text-muted-foreground pt-2 border-t">
                <FileText className="h-4 w-4 mt-0.5" />
                <p className="italic">{appointment.notes}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setEditingAppointment(appointment)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingAppointment(appointment)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="space-y-8">
        {upcomingAppointments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </div>
        )}

        {pastAppointments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </div>
        )}

        {appointments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No appointments scheduled</p>
            </CardContent>
          </Card>
        )}
      </div>

      {editingAppointment && (
        <EditAppointmentDialog
          appointment={editingAppointment}
          members={members}
          open={!!editingAppointment}
          onOpenChange={(open) => !open && setEditingAppointment(null)}
        />
      )}

      {deletingAppointment && (
        <DeleteAppointmentDialog
          appointment={deletingAppointment}
          open={!!deletingAppointment}
          onOpenChange={(open) => !open && setDeletingAppointment(null)}
        />
      )}
    </>
  );
}
