import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { InterviewService } from "@/services/interviews.service";
import { logger } from "@/lib/logger";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: Request, res: Response) {
  try {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return NextResponse.json(data, { status: 200 });
    }else{
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    };
  } catch (err) {
    logger.error("Error while get applications");

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
