import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request, res: Response) {
  try {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return NextResponse.json(data, {
        status: 200,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    } else {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  } catch (err) {
    logger.error("Error while get applications");

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
