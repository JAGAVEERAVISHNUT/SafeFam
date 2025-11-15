"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { AddVaccinationDialog } from "@/components/add-vaccination-dialog";
import { FamilyMember } from "@/lib/types/database";

interface AddVaccinationButtonProps {
  members: FamilyMember[];
}

export function AddVaccinationButton({ members }: AddVaccinationButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Vaccination
      </Button>
      <AddVaccinationDialog members={members} open={open} onOpenChange={setOpen} />
    </>
  );
}
