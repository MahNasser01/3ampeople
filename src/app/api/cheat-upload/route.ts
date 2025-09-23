import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const supabase = createClientComponentClient();
export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const interviewId = (form.get("interview_id") as string) || "unknown";
  const callId = (form.get("call_id") as string) || "no-call-id";
  const mimeType = (form.get("mime_type") as string) || "video/webm";

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const ext = mimeType.includes("webm") ? ".webm" : "";
  const filename = `interview-${interviewId}-${callId}-${ts}${ext}`;
  let publicPath: string | null = null;

  // ---- ✅ Supabase Upload ----
  const bucket = process.env.SUPABASE_CHEAT_BUCKET || "cheat_videos";

  const storagePath = `${interviewId}/${callId}`;

  const { error: uploadErr } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadErr) {
    console.error("Upload failed:", uploadErr);
  } else {
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    publicPath = pub?.publicUrl ?? null;
  }


  // ---- Fallback local save ----
  if (!publicPath) {
    const uploadsDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const localFilePath = path.join(uploadsDir, filename);
    await writeFile(localFilePath, buffer);
    publicPath = `/uploads/${filename}`;
  }

  // ---- Save metadata ----
  try {
    await supabase.from("cheat_file").insert({
      interview_id: interviewId,
      call_id: callId,
      email: (form.get("email") as string) || "",
      name: (form.get("name") as string) || "",
      file_path: publicPath,
      mime_type: mimeType,
      status: "uploaded",
    });

  } catch (e) {
    console.error("Failed to insert cheat_file row", e);
  }

  return NextResponse.json({ ok: true, path: publicPath }, { status: 200 });
}