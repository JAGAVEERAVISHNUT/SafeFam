"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
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

interface AddFamilyMemberDialogProps {
  familyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFamilyMemberDialog({
  familyId,
  open,
  onOpenChange,
}: AddFamilyMemberDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    relationship: "",
    dateOfBirth: "",
    bloodType: "",
    allergies: "",
    chronicConditions: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error: insertError } = await supabase.from("family_members").insert({
        family_id: familyId,
        full_name: formData.fullName,
        relationship: formData.relationship || null,
        date_of_birth: formData.dateOfBirth || null,
        blood_type: formData.bloodType || null,
        allergies: formData.allergies
          ? formData.allergies.split(",").map((a) => a.trim())
          : null,
        chronic_conditions: formData.chronicConditions
          ? formData.chronicConditions.split(",").map((c) => c.trim())
          : null,
        emergency_contact: formData.emergencyContact || null,
        emergency_phone: formData.emergencyPhone || null,
        is_primary_account: false,
      });

      if (insertError) throw insertError;

      onOpenChange(false);
      setFormData({
        fullName: "",
        relationship: "",
        dateOfBirth: "",
        bloodType: "",
        allergies: "",
        chronicConditions: "",
        emergencyContact: "",
        emergencyPhone: "",
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
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>
            Add a new family member to track their health information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                placeholder="e.g., Son, Daughter, Spouse"
                value={formData.relationship}
                onChange={(e) =>
                  setFormData({ ...formData, relationship: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Input
                id="bloodType"
                placeholder="e.g., A+, O-, AB+"
                value={formData.bloodType}
                onChange={(e) =>
                  setFormData({ ...formData, bloodType: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                placeholder="Separate multiple allergies with commas"
                value={formData.allergies}
                onChange={(e) =>
                  setFormData({ ...formData, allergies: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="chronicConditions">Chronic Conditions</Label>
              <Textarea
                id="chronicConditions"
                placeholder="Separate multiple conditions with commas"
                value={formData.chronicConditions}
                onChange={(e) =>
                  setFormData({ ...formData, chronicConditions: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContact: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyPhone: e.target.value })
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
                {isLoading ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
