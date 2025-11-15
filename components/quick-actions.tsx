import { Card } from "@/components/ui/card";
import { Pill, Calendar, Syringe, FileText, Users, Activity } from 'lucide-react';
import Link from "next/link";

interface QuickActionsProps {
  familyId: string;
}

export function QuickActions({ familyId }: QuickActionsProps) {
  const actions = [
    {
      icon: Pill,
      label: "Medications",
      href: "/medications",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Calendar,
      label: "Appointments",
      href: "/appointments",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Syringe,
      label: "Vaccinations",
      href: "/vaccinations",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: FileText,
      label: "Health Records",
      href: "/records",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Users,
      label: "Family",
      href: "/family",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      icon: Activity,
      label: "Insights",
      href: "/insights",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((action) => (
        <Link key={action.label} href={action.href}>
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className={`${action.bgColor} p-3 rounded-full`}>
                <action.icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
