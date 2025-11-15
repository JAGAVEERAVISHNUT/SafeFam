"use client";

import { Button } from "@/components/ui/button";
import { Bell, LogOut, Settings, AlertCircle } from 'lucide-react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  familyName: string;
  userName: string;
}

export function DashboardHeader({ familyName, userName }: DashboardHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-shrink">
            <Link href="/dashboard">
              <h1 className="text-xl md:text-2xl font-bold text-primary">SafeFam</h1>
            </Link>
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <p className="hidden sm:block text-sm text-muted-foreground truncate">{familyName}</p>
          </div>

          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Link href="/emergency">
              <Button variant="destructive" size="sm" className="h-8 px-2 md:px-3">
                <AlertCircle className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Emergency</span>
              </Button>
            </Link>
            
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                  <Settings className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/family">Family Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
