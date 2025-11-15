import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Shield, Users, Calendar } from 'lucide-react';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-primary mb-4 text-balance">
            SafeFam
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Your family&apos;s health, all in one place
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-16">
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Health Records</h3>
            <p className="text-sm text-muted-foreground">
              Keep all medical information organized and accessible
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 mb-4">
              <Calendar className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">Medication Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Never miss a dose with smart reminders and tracking
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Family Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage health information for your entire family
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted and protected at all times
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
