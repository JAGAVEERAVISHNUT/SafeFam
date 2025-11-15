import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Clock } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MedicationWithMember {
  id: string;
  name: string;
  dosage: string;
  time_of_day: string[];
  family_members: {
    full_name: string;
  };
}

interface MedicationRemindersProps {
  medications: MedicationWithMember[];
}

export function MedicationReminders({ medications }: MedicationRemindersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Medications</CardTitle>
        <Link href="/medications">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No active medications
          </p>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => (
              <div
                key={medication.id}
                className="flex gap-3 p-3 rounded-lg border"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Pill className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{medication.name}</p>
                  <p className="text-xs text-muted-foreground">{medication.family_members.full_name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{medication.dosage}</p>
                  {medication.time_of_day && medication.time_of_day.length > 0 && (
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{medication.time_of_day.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
