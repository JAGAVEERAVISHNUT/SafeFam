"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { AddMedicationDialog } from "@/components/add-medication-dialog";
import { FamilyMember } from "@/lib/types/database";

interface AddMedicationButtonProps {
  members: FamilyMember[];
}

export function AddMedicationButton({ members }: AddMedicationButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Medication
      </Button>
      <AddMedicationDialog members={members} open={open} onOpenChange={setOpen} />
    </>
  );
}
