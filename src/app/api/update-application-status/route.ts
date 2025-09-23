import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ATSStatus } from "@/types/ats";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(req: Request) {
  try {
    const { applicationId, status } = await req.json();

    console.log("Updating application status:", { applicationId, status });

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Application ID and status are required" },
        { status: 400 },
      );
    }

    // Validate status
    if (!Object.values(ATSStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const supabase = createClientComponentClient();

    console.log("Attempting to update application with ID:", applicationId);

    // Convert string ID to number since the database uses BIGSERIAL
    const numericId = parseInt(applicationId, 10);
    if (isNaN(numericId)) {
      console.error("Invalid application ID:", applicationId);
      return NextResponse.json(
        { error: "Invalid application ID format" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", numericId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      logger.error("Error updating application status:", error);
      return NextResponse.json(
        { error: "Failed to update application status" },
        { status: 500 },
      );
    }

    console.log("Successfully updated application:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error in update-application-status:", err);
    logger.error(
      "Error while updating application status:",
      err instanceof Error ? err.message : String(err),
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
