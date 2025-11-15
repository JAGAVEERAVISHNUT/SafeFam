"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Appointment, FamilyMember } from "@/lib/types/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditAppointmentDialogProps {
  appointment: Appointment;
  members: FamilyMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAppointmentDialog({
  appointment,
  members,
  open,
  onOpenChange,
}: EditAppointmentDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const appointmentDate = new Date(appointment.appointment_date);
  const [formData, setFormData] = useState({
    familyMemberId: appointment.family_member_id,
    title: appointment.title,
    appointmentType: appointment.appointment_type,
    doctorName: appointment.doctor_name || "",
    location: appointment.location || "",
    appointmentDate: appointmentDate.toISOString().split('T')[0],
    appointmentTime: appointmentDate.toTimeString().slice(0, 5),
    durationMinutes: appointment.duration_minutes.toString(),
    notes: appointment.notes || "",
    status: appointment.status,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

      const { error: updateError } = await supabase
        .from("appointments")
        .update({
          family_member_id: formData.familyMemberId,
          title: formData.title,
          appointment_type: formData.appointmentType,
          doctor_name: formData.doctorName || null,
          location: formData.location || null,
          appointment_date: appointmentDateTime,
          duration_minutes: parseInt(formData.durationMinutes),
          notes: formData.notes || null,
          status: formData.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointment.id);

      if (updateError) throw updateError;

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogDescription>Update appointment details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as typeof formData.status })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="familyMemberId">Family Member *</Label>
              <Select
                value={formData.familyMemberId}
                onValueChange={(value) =>
                  setFormData({ ...formData, familyMemberId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Appointment Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="appointmentType">Appointment Type *</Label>
              <Input
                id="appointmentType"
                required
                value={formData.appointmentType}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentType: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorName: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  min="1"
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    setFormData({ ...formData, durationMinutes: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="appointmentDate">Date *</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  required
                  value={formData.appointmentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentDate: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="appointmentTime">Time *</Label>
                <Input
                  id="appointmentTime"
                  type="time"
                  required
                  value={formData.appointmentTime}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
