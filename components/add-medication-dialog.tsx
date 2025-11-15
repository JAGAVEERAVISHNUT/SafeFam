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

interface AddMedicationDialogProps {
  members: FamilyMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMedicationDialog({
  members,
  open,
  onOpenChange,
}: AddMedicationDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    familyMemberId: "",
    name: "",
    dosage: "",
    frequency: "",
    timeOfDay: "",
    startDate: "",
    endDate: "",
    instructions: "",
    prescribingDoctor: "",
    pharmacy: "",
    refillReminderDays: "7",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error: insertError } = await supabase.from("medications").insert({
        family_member_id: formData.familyMemberId,
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        time_of_day: formData.timeOfDay
          ? formData.timeOfDay.split(",").map((t) => t.trim())
          : [],
        start_date: formData.startDate,
        end_date: formData.endDate || null,
        instructions: formData.instructions || null,
        prescribing_doctor: formData.prescribingDoctor || null,
        pharmacy: formData.pharmacy || null,
        refill_reminder_days: parseInt(formData.refillReminderDays),
        is_active: true,
      });

      if (insertError) throw insertError;

      onOpenChange(false);
      setFormData({
        familyMemberId: "",
        name: "",
        dosage: "",
        frequency: "",
        timeOfDay: "",
        startDate: "",
        endDate: "",
        instructions: "",
        prescribingDoctor: "",
        pharmacy: "",
        refillReminderDays: "7",
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
          <DialogTitle>Add Medication</DialogTitle>
          <DialogDescription>
            Add a new medication to track for a family member
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
              <Label htmlFor="name">Medication Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 500mg"
                  required
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Input
                  id="frequency"
                  placeholder="e.g., Twice daily"
                  required
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="timeOfDay">Time of Day</Label>
              <Input
                id="timeOfDay"
                placeholder="e.g., Morning, Evening (separate with commas)"
                value={formData.timeOfDay}
                onChange={(e) =>
                  setFormData({ ...formData, timeOfDay: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Special instructions for taking this medication"
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prescribingDoctor">Prescribing Doctor</Label>
                <Input
                  id="prescribingDoctor"
                  value={formData.prescribingDoctor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prescribingDoctor: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pharmacy">Pharmacy</Label>
                <Input
                  id="pharmacy"
                  value={formData.pharmacy}
                  onChange={(e) =>
                    setFormData({ ...formData, pharmacy: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="refillReminderDays">Refill Reminder (Days Before)</Label>
              <Input
                id="refillReminderDays"
                type="number"
                min="1"
                value={formData.refillReminderDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    refillReminderDays: e.target.value,
                  })
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
                {isLoading ? "Adding..." : "Add Medication"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
