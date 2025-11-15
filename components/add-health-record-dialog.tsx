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

interface AddHealthRecordDialogProps {
  members: FamilyMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddHealthRecordDialog({
  members,
  open,
  onOpenChange,
}: AddHealthRecordDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    familyMemberId: "",
    recordType: "",
    title: "",
    description: "",
    date: "",
    doctorName: "",
    facility: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error: insertError } = await supabase.from("health_records").insert({
        family_member_id: formData.familyMemberId,
        record_type: formData.recordType,
        title: formData.title,
        description: formData.description || null,
        date: formData.date,
        doctor_name: formData.doctorName || null,
        facility: formData.facility || null,
      });

      if (insertError) throw insertError;

      onOpenChange(false);
      setFormData({
        familyMemberId: "",
        recordType: "",
        title: "",
        description: "",
        date: "",
        doctorName: "",
        facility: "",
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
          <DialogTitle>Add Health Record</DialogTitle>
          <DialogDescription>
            Add a new health record or document
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
              <Label htmlFor="recordType">Record Type *</Label>
              <Input
                id="recordType"
                placeholder="e.g., Lab Results, Imaging, Diagnosis"
                required
                value={formData.recordType}
                onChange={(e) =>
                  setFormData({ ...formData, recordType: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Blood Test Results"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Details about this record"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
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
                <Label htmlFor="facility">Facility</Label>
                <Input
                  id="facility"
                  placeholder="Hospital or clinic name"
                  value={formData.facility}
                  onChange={(e) =>
                    setFormData({ ...formData, facility: e.target.value })
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
                {isLoading ? "Adding..." : "Add Record"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
