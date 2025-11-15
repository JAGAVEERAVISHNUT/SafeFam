"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { FamilyMember } from "@/lib/types/database";
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

interface AddAppointmentDialogProps {
  members: FamilyMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAppointmentDialog({
  members,
  open,
  onOpenChange,
}: AddAppointmentDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    familyMemberId: "",
    title: "",
    appointmentType: "",
    doctorName: "",
    location: "",
    appointmentDate: "",
    appointmentTime: "",
    durationMinutes: "30",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

      const { error: insertError } = await supabase.from("appointments").insert({
        family_member_id: formData.familyMemberId,
        title: formData.title,
        appointment_type: formData.appointmentType,
        doctor_name: formData.doctorName || null,
        location: formData.location || null,
        appointment_date: appointmentDateTime,
        duration_minutes: parseInt(formData.durationMinutes),
        notes: formData.notes || null,
        status: "scheduled",
      });

      if (insertError) throw insertError;

      onOpenChange(false);
      setFormData({
        familyMemberId: "",
        title: "",
        appointmentType: "",
        doctorName: "",
        location: "",
        appointmentDate: "",
        appointmentTime: "",
        durationMinutes: "30",
        notes: "",
      });
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
          <DialogTitle>Schedule Appointment</DialogTitle>
          <DialogDescription>
            Add a new medical appointment for a family member
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
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
                  <SelectValue placeholder="Select a family member" />
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
                placeholder="e.g., Annual Checkup"
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
                placeholder="e.g., Checkup, Consultation, Follow-up"
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
                  placeholder="Dr. Smith"
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
                placeholder="Clinic or hospital address"
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
                placeholder="Any additional notes or preparation needed"
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
                {isLoading ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
