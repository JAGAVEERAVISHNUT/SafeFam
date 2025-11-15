"use client";

import { Vaccination } from "@/lib/types/database";
import { FamilyMember } from "@/lib/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Syringe, Calendar, User, MapPin, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useState } from "react";
import { EditVaccinationDialog } from "@/components/edit-vaccination-dialog";
import { DeleteVaccinationDialog } from "@/components/delete-vaccination-dialog";

interface VaccinationWithMember extends Vaccination {
  family_members: {
    full_name: string;
  };
}

interface VaccinationsListProps {
  vaccinations: VaccinationWithMember[];
  members: FamilyMember[];
}

export function VaccinationsList({ vaccinations, members }: VaccinationsListProps) {
  const [editingVaccination, setEditingVaccination] = useState<VaccinationWithMember | null>(null);
  const [deletingVaccination, setDeletingVaccination] = useState<VaccinationWithMember | null>(null);

  return (
    <>
      {vaccinations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No vaccination records yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vaccinations.map((vaccination) => (
            <Card key={vaccination.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Syringe className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{vaccination.vaccine_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{vaccination.family_members.full_name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Administered: {new Date(vaccination.date_administered).toLocaleDateString()}
                    </span>
                  </div>

                  {vaccination.next_dose_date && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        Next Dose: {new Date(vaccination.next_dose_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {vaccination.administered_by && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">By:</span> {vaccination.administered_by}
                    </p>
                  )}

                  {vaccination.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{vaccination.location}</span>
                    </div>
                  )}

                  {vaccination.batch_number && (
                    <p className="text-xs text-muted-foreground pt-2 border-t">
                      Batch: {vaccination.batch_number}
                    </p>
                  )}

                  {vaccination.notes && (
                    <p className="text-sm text-muted-foreground italic pt-2 border-t">
                      {vaccination.notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditingVaccination(vaccination)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingVaccination(vaccination)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingVaccination && (
        <EditVaccinationDialog
          vaccination={editingVaccination}
          members={members}
          open={!!editingVaccination}
          onOpenChange={(open) => !open && setEditingVaccination(null)}
        />
      )}

      {deletingVaccination && (
        <DeleteVaccinationDialog
          vaccination={deletingVaccination}
          open={!!deletingVaccination}
          onOpenChange={(open) => !open && setDeletingVaccination(null)}
        />
      )}
    </>
  );
}
