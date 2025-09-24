"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ApplyPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [loadingPositions, setLoadingPositions] = useState<boolean>(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const supabase = createClientComponentClient();

        const { data, error } = await supabase
          .from("interview")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw new Error(error.message || "Failed to fetch positions");
        }

        const validPositions = (data || [])
          .filter((x: any) => !!x?.name && !!x?.id && x?.is_active !== false)
          .map((x: any) => ({ id: x.id as string, name: x.name as string }));

        setPositions(validPositions);
      } catch (err: any) {
        console.error("Failed to load job positions:", err);
        setError("Failed to load job positions. Please refresh the page.");
      } finally {
        setLoadingPositions(false);
      }
    };

    fetchPositions();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setError(null);
      setIsSubmitting(true);

      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Submission failed");
      }

      toast({
        title: "Application submitted successfully!",
        description: "We received your application and will review it soon.",
      });
      form.reset();
    } catch (err: any) {
      const message = err?.message || "Something went wrong";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Apply</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Submit your details and resume. We'll be in touch soon.
        </p>
        <Separator className="my-6" />
        {error && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Loading overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 flex flex-col items-center space-y-6 shadow-2xl max-w-md mx-4">
              <div className="relative flex items-center justify-center">
                {/* Loading Time Image */}
                <div className="relative">
                  <img
                    src="/Loading-Time.png"
                    alt="Loading"
                    className="w-24 h-24 object-contain animate-pulse"
                  />
                  {/* Spinning ring around the image */}
                  <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-primary-500 border-r-primary-500 rounded-full animate-spin"></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Processing Application
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Please wait while we analyze your resume and process your
                  application...
                </p>
                <div className="flex items-center justify-center space-x-1 mt-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="full_name">Full name</Label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                disabled={isSubmitting}
                placeholder="Jane Doe"
                className="h-10 rounded-md border bg-transparent px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email address</Label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isSubmitting}
                placeholder="jane@example.com"
                className="h-10 rounded-md border bg-transparent px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="job_position">Job position</Label>
              <select
                id="job_position"
                name="job_position"
                required
                disabled={isSubmitting || loadingPositions}
                className="h-10 rounded-md border bg-transparent px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                defaultValue=""
              >
                <option value="" disabled>
                  {loadingPositions
                    ? "Loading positions..."
                    : "Select a position"}
                </option>
                {positions.length === 0 && !loadingPositions && (
                  <option value="" disabled>
                    No positions available
                  </option>
                )}
                {positions.map((p) => (
                  <option key={p.id} value={`${p.id}-${p.name}`}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                disabled={isSubmitting}
                placeholder="+1 555 123 4567"
                className="h-10 rounded-md border bg-transparent px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cover_letter">Short cover letter (optional)</Label>
            <Textarea
              id="cover_letter"
              name="cover_letter"
              placeholder="Briefly tell us why you're a great fit"
              disabled={isSubmitting}
              className="min-h-28 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="resume">Resume (PDF)</Label>
            <input
              id="resume"
              name="resume"
              type="file"
              accept="application/pdf"
              required
              disabled={isSubmitting}
              className="text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="relative">
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                "Submit application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
