"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OnboardingFormProps {
  userId: string;
}

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    familyName: "",
    fullName: "",
    dateOfBirth: "",
    bloodType: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      // Create family
      const { data: family, error: familyError } = await supabase
        .from("families")
        .insert({
          name: formData.familyName,
          created_by: userId,
        })
        .select()
        .maybeSingle();

      if (familyError) throw familyError;
      if (!family) throw new Error("Failed to create family");

      // Create family member (user themselves)
      const { error: memberError } = await supabase
        .from("family_members")
        .insert({
          family_id: family.id,
          profile_id: userId,
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth || null,
          blood_type: formData.bloodType || null,
          emergency_contact: formData.emergencyContact || null,
          emergency_phone: formData.emergencyPhone || null,
          is_primary_account: true,
        });

      if (memberError) throw memberError;

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Family Profile</CardTitle>
        <CardDescription>
          This information will help us keep your family&apos;s health records organized
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                placeholder="The Smith Family"
                required
                value={formData.familyName}
                onChange={(e) =>
                  setFormData({ ...formData, familyName: e.target.value })
                }
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Your Information</h3>
              
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Smith"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bloodType">Blood Type (Optional)</Label>
                  <Input
                    id="bloodType"
                    placeholder="A+"
                    value={formData.bloodType}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodType: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Jane Smith"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyContact: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.emergencyPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyPhone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Profile..." : "Continue to Dashboard"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
