"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Medication, FamilyMember } from "@/lib/types/database";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditMedicationDialogProps {
  medication: Medication;
  members: FamilyMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMedicationDialog({
  medication,
  members,
  open,
  onOpenChange,
}: EditMedicationDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    familyMemberId: medication.family_member_id,
    name: medication.name,
    dosage: medication.dosage,
    frequency: medication.frequency,
    timeOfDay: medication.time_of_day?.join(", ") || "",
    startDate: medication.start_date,
    endDate: medication.end_date || "",
    instructions: medication.instructions || "",
    prescribingDoctor: medication.prescribing_doctor || "",
    pharmacy: medication.pharmacy || "",
    refillReminderDays: medication.refill_reminder_days.toString(),
    isActive: medication.is_active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error: updateError } = await supabase
        .from("medications")
        .update({
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
          is_active: formData.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", medication.id);

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
          <DialogTitle>Edit Medication</DialogTitle>
          <DialogDescription>Update medication details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <Label htmlFor="isActive">Active Medication</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
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
