"use client";

import { Medication } from "@/lib/types/database";
import { FamilyMember } from "@/lib/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, Calendar, User, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { useState } from "react";
import { EditMedicationDialog } from "@/components/edit-medication-dialog";
import { DeleteMedicationDialog } from "@/components/delete-medication-dialog";
import { LogMedicationDialog } from "@/components/log-medication-dialog";

interface MedicationWithMember extends Medication {
  family_members: {
    full_name: string;
  };
}

interface MedicationsListProps {
  medications: MedicationWithMember[];
  members: FamilyMember[];
}

export function MedicationsList({ medications, members }: MedicationsListProps) {
  const [editingMedication, setEditingMedication] = useState<MedicationWithMember | null>(null);
  const [deletingMedication, setDeletingMedication] = useState<MedicationWithMember | null>(null);
  const [loggingMedication, setLoggingMedication] = useState<MedicationWithMember | null>(null);

  const activeMedications = medications.filter(m => m.is_active);
  const inactiveMedications = medications.filter(m => !m.is_active);

  const MedicationCard = ({ medication }: { medication: MedicationWithMember }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Pill className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{medication.name}</h3>
                {medication.is_active ? (
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{medication.family_members.full_name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <p><span className="font-medium">Dosage:</span> {medication.dosage}</p>
          <p><span className="font-medium">Frequency:</span> {medication.frequency}</p>
          
          {medication.time_of_day && medication.time_of_day.length > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{medication.time_of_day.join(", ")}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              Started: {new Date(medication.start_date).toLocaleDateString()}
              {medication.end_date && ` - ${new Date(medication.end_date).toLocaleDateString()}`}
            </span>
          </div>

          {medication.instructions && (
            <p className="text-muted-foreground italic pt-2 border-t">
              {medication.instructions}
            </p>
          )}

          {medication.prescribing_doctor && (
            <p className="text-muted-foreground">
              <span className="font-medium">Doctor:</span> {medication.prescribing_doctor}
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          {medication.is_active && (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => setLoggingMedication(medication)}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Log Dose
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingMedication(medication)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeletingMedication(medication)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="space-y-8">
        {activeMedications.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Medications</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeMedications.map((medication) => (
                <MedicationCard key={medication.id} medication={medication} />
              ))}
            </div>
          </div>
        )}

        {inactiveMedications.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Inactive Medications</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inactiveMedications.map((medication) => (
                <MedicationCard key={medication.id} medication={medication} />
              ))}
            </div>
          </div>
        )}

        {medications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No medications added yet</p>
            </CardContent>
          </Card>
        )}
      </div>

      {editingMedication && (
        <EditMedicationDialog
          medication={editingMedication}
          members={members}
          open={!!editingMedication}
          onOpenChange={(open) => !open && setEditingMedication(null)}
        />
      )}

      {deletingMedication && (
        <DeleteMedicationDialog
          medication={deletingMedication}
          open={!!deletingMedication}
          onOpenChange={(open) => !open && setDeletingMedication(null)}
        />
      )}

      {loggingMedication && (
        <LogMedicationDialog
          medication={loggingMedication}
          open={!!loggingMedication}
          onOpenChange={(open) => !open && setLoggingMedication(null)}
        />
      )}
    </>
  );
}
