"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { AddFamilyMemberDialog } from "@/components/add-family-member-dialog";

interface AddFamilyMemberButtonProps {
  familyId: string;
}

export function AddFamilyMemberButton({ familyId }: AddFamilyMemberButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Family Member
      </Button>
      <AddFamilyMemberDialog familyId={familyId} open={open} onOpenChange={setOpen} />
    </>
  );
}
