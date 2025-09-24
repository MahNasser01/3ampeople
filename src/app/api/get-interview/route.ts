import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export async function GET(req: Request, res: Response) {
  try {
    const { data, error } = await supabase
      .from("interview")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return NextResponse.json(data, { status: 200 });
    }else{
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    };
  } catch (err) {
    logger.error("Error creating interview");

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
