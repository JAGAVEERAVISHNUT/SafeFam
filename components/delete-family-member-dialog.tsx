"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { FamilyMember } from "@/lib/types/database";
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

interface DeleteFamilyMemberDialogProps {
  member: FamilyMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteFamilyMemberDialog({
  member,
  open,
  onOpenChange,
}: DeleteFamilyMemberDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("id", member.id);

      if (error) throw error;

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      console.error("[v0] Error deleting family member:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Family Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {member.full_name}? This will permanently remove all their
            health records, medications, appointments, and other data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
