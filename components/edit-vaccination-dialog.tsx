"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Vaccination, FamilyMember } from "@/lib/types/database";
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

interface EditVaccinationDialogProps {
  vaccination: Vaccination;
  members: FamilyMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditVaccinationDialog({
  vaccination,
  members,
  open,
  onOpenChange,
}: EditVaccinationDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    familyMemberId: vaccination.family_member_id,
    vaccineName: vaccination.vaccine_name,
    dateAdministered: vaccination.date_administered,
    nextDoseDate: vaccination.next_dose_date || "",
    administeredBy: vaccination.administered_by || "",
    location: vaccination.location || "",
    batchNumber: vaccination.batch_number || "",
    notes: vaccination.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error: updateError } = await supabase
        .from("vaccinations")
        .update({
          family_member_id: formData.familyMemberId,
          vaccine_name: formData.vaccineName,
          date_administered: formData.dateAdministered,
          next_dose_date: formData.nextDoseDate || null,
          administered_by: formData.administeredBy || null,
          location: formData.location || null,
          batch_number: formData.batchNumber || null,
          notes: formData.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", vaccination.id);

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
          <DialogTitle>Edit Vaccination Record</DialogTitle>
          <DialogDescription>Update vaccination details</DialogDescription>
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
              <Label htmlFor="vaccineName">Vaccine Name *</Label>
              <Input
                id="vaccineName"
                required
                value={formData.vaccineName}
                onChange={(e) =>
                  setFormData({ ...formData, vaccineName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dateAdministered">Date Administered *</Label>
                <Input
                  id="dateAdministered"
                  type="date"
                  required
                  value={formData.dateAdministered}
                  onChange={(e) =>
                    setFormData({ ...formData, dateAdministered: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nextDoseDate">Next Dose Date (Optional)</Label>
                <Input
                  id="nextDoseDate"
                  type="date"
                  value={formData.nextDoseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, nextDoseDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="administeredBy">Administered By</Label>
              <Input
                id="administeredBy"
                value={formData.administeredBy}
                onChange={(e) =>
                  setFormData({ ...formData, administeredBy: e.target.value })
                }
              />
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

            <div className="grid gap-2">
              <Label htmlFor="batchNumber">Batch Number</Label>
              <Input
                id="batchNumber"
                value={formData.batchNumber}
                onChange={(e) =>
                  setFormData({ ...formData, batchNumber: e.target.value })
                }
              />
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
