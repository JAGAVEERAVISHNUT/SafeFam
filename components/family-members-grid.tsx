import { FamilyMember } from "@/lib/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FamilyMembersGridProps {
  members: FamilyMember[];
}

export function FamilyMembersGrid({ members }: FamilyMembersGridProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Family Members</CardTitle>
        <Link href="/family">
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {members.map((member) => (
            <Link key={member.id} href={`/member/${member.id}`}>
              <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{member.full_name}</p>
                  {member.relationship && (
                    <p className="text-sm text-muted-foreground">{member.relationship}</p>
                  )}
                  {member.date_of_birth && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(member.date_of_birth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
