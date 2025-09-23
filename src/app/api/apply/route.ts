import { NextResponse } from "next/server";
import { ApplicationsService } from "@/services/applications.service";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { parsePdf } from "@/actions/parse-pdf";
import { OpenAI } from "openai";
import { logger } from "@/lib/logger";
import { getExtractionDataPrompt } from "@/lib/prompts/extraction-data";
import { getScoringResumePrompt } from "@/lib/prompts/scoring-resume";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const full_name = String(formData.get("full_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const cover_letter = String(formData.get("cover_letter") || "").trim();
    const job_position_raw = String(formData.get("job_position") || "").trim();
    const resumeFile = formData.get("resume") as File | null;

    if (!full_name || !email || !phone || !resumeFile || !job_position_raw) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Parse the combined value format: "interviewId-interviewName"
    const positionParts = job_position_raw.split("-");
    if (positionParts.length < 2) {
      return NextResponse.json({ error: "Invalid job position format" }, { status: 400 });
    }
    
    const interview_id = positionParts[0];
    const job_position = positionParts[1];

    const supabase = createClientComponentClient();

    // Upload resume to Supabase Storage (create bucket `resumes` manually or via SQL)
    const arrayBuffer = await resumeFile.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);
    const path = `${Date.now()}-${resumeFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(path, fileBytes, {
        contentType: resumeFile.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from("resumes").getPublicUrl(uploadData.path);
    const resume_url = publicUrlData.publicUrl;
    logger.info("Resume URL:", resume_url);
    console.log("Resume URL:", resume_url);

    // Validate file type
    if (!(resumeFile.type || "").includes("pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    // OCR / parsing
    let parsedText = "";
    try {
      const fd = new FormData();
      fd.append("file", resumeFile);
      const parsed = await parsePdf(fd);
      if (parsed?.success) {
        parsedText = parsed.text || "";
      } else {
        logger.error("PDF parsing failed:", parsed?.error || "Unknown error");
        return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
      }
    } catch (error) {
      logger.error("PDF parsing error:", String(error));
      return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
    }

    if (!parsedText.trim()) {
      return NextResponse.json({ error: "No text found in PDF" }, { status: 400 });
    }

    logger.info("Parsed text length:", String(parsedText.length));
    

    // Structured extraction
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey });

    let analyzed_resume: any = {};
    try {
      const extraction = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: "You are a strict JSON generator. Always return valid JSON only." },
          { role: "user", content: getExtractionDataPrompt(parsedText) },
        ],
        response_format: { type: "json_object" },
      });
      
      const extractionContent = extraction.choices?.[0]?.message?.content || "{}";
      logger.info("Extraction content:", extractionContent);
      
      analyzed_resume = JSON.parse(extractionContent);
      logger.info("Parsed resume data:", JSON.stringify(analyzed_resume));
    } catch (error) {
      logger.error("Resume extraction error:", String(error));
      // Continue with empty data rather than failing
      analyzed_resume = {};
    }

    // Scoring against job position
    let resume_score = 0;
    try {

      const scoreResp = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: "Return only a number 0-10." },
          { role: "user", content: getScoringResumePrompt(parsedText, job_position) },
        ],
      });
      
      const scoreRaw = scoreResp.choices?.[0]?.message?.content || "0";
      resume_score = Math.max(0, Math.min(10, parseInt(scoreRaw.replace(/[^0-9]/g, "")) || 0));
      logger.info("Resume score:", String(resume_score));
      
    } catch (error) {
      logger.error("Resume scoring error:", String(error));
      // Default to 0 if scoring fails
      resume_score = 0;
    }

    const id = await ApplicationsService.createApplication({
      full_name,
      email,
      phone,
      job_position,
      interview_id,
      cover_letter,
      resume_url,
      parsed_resume: parsedText,
      analyzed_resume,
      resume_score,
    });

    if (!id) {
      return NextResponse.json({ error: "Failed to save application" }, { status: 500 });
    }

    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


