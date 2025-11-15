"use client";

import { HealthRecord } from "@/lib/types/database";
import { FamilyMember } from "@/lib/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User, Building, Edit, Trash2 } from 'lucide-react';
import { useState } from "react";
import { EditHealthRecordDialog } from "@/components/edit-health-record-dialog";
import { DeleteHealthRecordDialog } from "@/components/delete-health-record-dialog";

interface HealthRecordWithMember extends HealthRecord {
  family_members: {
    full_name: string;
  };
}

interface HealthRecordsListProps {
  records: HealthRecordWithMember[];
  members: FamilyMember[];
}

export function HealthRecordsList({ records, members }: HealthRecordsListProps) {
  const [editingRecord, setEditingRecord] = useState<HealthRecordWithMember | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<HealthRecordWithMember | null>(null);

  const recordsByType = records.reduce((acc, record) => {
    if (!acc[record.record_type]) {
      acc[record.record_type] = [];
    }
    acc[record.record_type].push(record);
    return acc;
  }, {} as Record<string, HealthRecordWithMember[]>);

  return (
    <>
      {records.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No health records yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(recordsByType).map(([type, typeRecords]) => (
            <div key={type}>
              <h2 className="text-xl font-semibold mb-4 capitalize">{type}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {typeRecords.map((record) => (
                  <Card key={record.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{record.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{record.family_members.full_name}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                        </div>

                        {record.doctor_name && (
                          <p className="text-muted-foreground">
                            <span className="font-medium">Doctor:</span> {record.doctor_name}
                          </p>
                        )}

                        {record.facility && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building className="h-4 w-4" />
                            <span className="truncate">{record.facility}</span>
                          </div>
                        )}

                        {record.description && (
                          <p className="text-muted-foreground italic pt-2 border-t line-clamp-3">
                            {record.description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setEditingRecord(record)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingRecord(record)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingRecord && (
        <EditHealthRecordDialog
          record={editingRecord}
          members={members}
          open={!!editingRecord}
          onOpenChange={(open) => !open && setEditingRecord(null)}
        />
      )}

      {deletingRecord && (
        <DeleteHealthRecordDialog
          record={deletingRecord}
          open={!!deletingRecord}
          onOpenChange={(open) => !open && setDeletingRecord(null)}
        />
      )}
    </>
  );
}
