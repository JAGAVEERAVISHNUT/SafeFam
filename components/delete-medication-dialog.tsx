"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Medication } from "@/lib/types/database";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteMedicationDialogProps {
  medication: Medication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteMedicationDialog({
  medication,
  open,
  onOpenChange,
}: DeleteMedicationDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("medications")
        .delete()
        .eq("id", medication.id);

      if (error) throw error;

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      console.error("[v0] Error deleting medication:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Medication</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {medication.name}? This will also delete all
            associated medication logs. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
