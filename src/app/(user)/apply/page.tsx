"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


export default function ApplyPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingPositions, setLoadingPositions] = useState<boolean>(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch("/api/get-interview");
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch positions");
        }
        
        const validPositions = data
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
        description: "We received your application and will review it soon." 
      });
      form.reset();
    } catch (err: any) {
      const message = err?.message || "Something went wrong";
      setError(message);
      toast({ 
        title: "Error", 
        description: message, 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Apply</h1>
        <p className="mt-1 text-sm text-muted-foreground">Submit your details and resume. We'll be in touch soon.</p>
        <Separator className="my-6" />
        {error && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
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
                placeholder="Jane Doe"
                className="h-10 rounded-md border bg-transparent px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email address</Label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jane@example.com"
                className="h-10 rounded-md border bg-transparent px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                className="h-10 rounded-md border bg-transparent px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                defaultValue=""
              >
                <option value="" disabled>
                  {loadingPositions ? "Loading positions..." : "Select a position"}
                </option>
                {positions.length === 0 && !loadingPositions && (
                  <option value="" disabled>No positions available</option>
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
                placeholder="+1 555 123 4567"
                className="h-10 rounded-md border bg-transparent px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cover_letter">Short cover letter</Label>
            <Textarea id="cover_letter" name="cover_letter" placeholder="Briefly tell us why you're a great fit" className="min-h-28" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="resume">Resume (PDF)</Label>
            <input id="resume" name="resume" type="file" accept="application/pdf" required className="text-sm" />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


