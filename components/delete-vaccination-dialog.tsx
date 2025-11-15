"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Vaccination } from "@/lib/types/database";
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

interface DeleteVaccinationDialogProps {
  vaccination: Vaccination;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteVaccinationDialog({
  vaccination,
  open,
  onOpenChange,
}: DeleteVaccinationDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("vaccinations")
        .delete()
        .eq("id", vaccination.id);

      if (error) throw error;

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      console.error("[v0] Error deleting vaccination:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Vaccination Record</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the {vaccination.vaccine_name} vaccination record?
            This action cannot be undone.
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
