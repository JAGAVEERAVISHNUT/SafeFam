"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { AddHealthRecordDialog } from "@/components/add-health-record-dialog";
import { FamilyMember } from "@/lib/types/database";

interface AddHealthRecordButtonProps {
  members: FamilyMember[];
}

export function AddHealthRecordButton({ members }: AddHealthRecordButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Record
      </Button>
      <AddHealthRecordDialog members={members} open={open} onOpenChange={setOpen} />
    </>
  );
}
