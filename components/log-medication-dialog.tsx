"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Medication } from "@/lib/types/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from 'lucide-react';

interface LogMedicationDialogProps {
  medication: Medication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogMedicationDialog({
  medication,
  open,
  onOpenChange,
}: LogMedicationDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const now = new Date();

    try {
      const { error: insertError } = await supabase.from("medication_logs").insert({
        medication_id: medication.id,
        scheduled_time: now.toISOString(),
        taken_time: now.toISOString(),
        status: "taken",
        notes: notes || null,
      });

      if (insertError) throw insertError;

      onOpenChange(false);
      setNotes("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Medication Dose</DialogTitle>
          <DialogDescription>
            Record that {medication.name} ({medication.dosage}) was taken
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any notes about this dose..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isLoading ? "Logging..." : "Log Dose"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
