"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { AddAppointmentDialog } from "@/components/add-appointment-dialog";
import { FamilyMember } from "@/lib/types/database";

interface AddAppointmentButtonProps {
  members: FamilyMember[];
}

export function AddAppointmentButton({ members }: AddAppointmentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Appointment
      </Button>
      <AddAppointmentDialog members={members} open={open} onOpenChange={setOpen} />
    </>
  );
}
