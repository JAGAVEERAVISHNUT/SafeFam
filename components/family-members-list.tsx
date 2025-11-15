"use client";

import { FamilyMember } from "@/lib/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, Droplet, Phone, Edit, Trash2 } from 'lucide-react';
import { useState } from "react";
import { EditFamilyMemberDialog } from "@/components/edit-family-member-dialog";
import { DeleteFamilyMemberDialog } from "@/components/delete-family-member-dialog";

interface FamilyMembersListProps {
  members: FamilyMember[];
  familyId: string;
}

export function FamilyMembersList({ members, familyId }: FamilyMembersListProps) {
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<FamilyMember | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{member.full_name}</h3>
                    {member.relationship && (
                      <p className="text-sm text-muted-foreground">{member.relationship}</p>
                    )}
                    {member.is_primary_account && (
                      <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Primary Account
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {member.date_of_birth && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(member.date_of_birth).toLocaleDateString()}</span>
                  </div>
                )}
                {member.blood_type && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplet className="h-4 w-4" />
                    <span>Blood Type: {member.blood_type}</span>
                  </div>
                )}
                {member.emergency_phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{member.emergency_phone}</span>
                  </div>
                )}
              </div>

              {member.allergies && member.allergies.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Allergies:</p>
                  <div className="flex flex-wrap gap-1">
                    {member.allergies.map((allergy, idx) => (
                      <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditingMember(member)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingMember(member)}
                  disabled={member.is_primary_account}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingMember && (
        <EditFamilyMemberDialog
          member={editingMember}
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
        />
      )}

      {deletingMember && (
        <DeleteFamilyMemberDialog
          member={deletingMember}
          open={!!deletingMember}
          onOpenChange={(open) => !open && setDeletingMember(null)}
        />
      )}
    </>
  );
}
