"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from "react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      
      // Check for hash parameters (Supabase sends tokens in URL hash)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      console.log('[v0] Reset password page - checking session', { hasAccessToken: !!accessToken, type });
      
      // If we have a recovery token in the URL, set the session
      if (accessToken && type === 'recovery') {
        console.log('[v0] Found recovery token, setting session');
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get('refresh_token') || '',
        });
        
        if (error) {
          console.error('[v0] Error setting session:', error);
          setError("Invalid or expired reset link. Please request a new password reset.");
          setIsChecking(false);
          return;
        }
      }
      
      // Verify we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('[v0] Session check result:', { hasSession: !!session, error: sessionError });
      
      if (session) {
        setIsValidSession(true);
        // Clean up the URL hash
        window.history.replaceState(null, '', window.location.pathname);
      } else {
        setError("Invalid or expired reset link. Please request a new password reset.");
      }
      setIsChecking(false);
    };
    
    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      console.log('[v0] Updating password');
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) throw error;
      console.log('[v0] Password updated successfully');
      setSuccess(true);
      
      // Sign out and redirect to login after 2 seconds
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
      }, 2000);
    } catch (error: unknown) {
      console.error('[v0] Error updating password:', error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">SafeFam</h1>
            <p className="text-muted-foreground">Family Health Management</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Verifying reset link...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">SafeFam</h1>
            <p className="text-muted-foreground">Family Health Management</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
              <CardDescription>Your password has been updated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-sm font-medium text-primary">
                  ✓ Password successfully reset!
                </p>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Redirecting you to sign in...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isValidSession && error) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">SafeFam</h1>
            <p className="text-muted-foreground">Family Health Management</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
              <CardDescription>This link has expired or is invalid</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={() => router.push("/auth/forgot-password")}
                >
                  Request New Reset Link
                </Button>
                <div className="text-center">
                  <Link href="/auth/login" className="text-sm text-primary hover:underline">
                    Return to Sign In
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">SafeFam</h1>
          <p className="text-muted-foreground">Family Health Management</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Set New Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading || !isValidSession}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
