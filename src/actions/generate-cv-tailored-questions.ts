// utils/generateCvTailoredQuestions.ts
import { logger } from "@/lib/logger";
import {
  generateQuestionsPrompt,
  SYSTEM_PROMPT,
} from "@/lib/prompts/generate-questions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import OpenAI from "openai";

const supabase = createClientComponentClient();

export type TailoredQuestion = { question: string };

/**
 * Fetches the parsed_resume for a candidate email and returns a helper you can
 * use later to persist the tailored questions into `public.interview_candidate`.
 *
 * It does NOT call the AI — you’ll do that with the returned `parsedResume`.
 */
export async function generateCvTailoredQuestions(
  interviewId: string,
  userEmail: string,
  numberOfTailoredQuestions: number
) {
  if (!userEmail) {
    throw new Error("userEmail is required");
  }
  if (
    !Number.isFinite(numberOfTailoredQuestions) ||
    numberOfTailoredQuestions <= 0
  ) {
    throw new Error("numberOfTailoredQuestions must be a positive number");
  }

  // Pull the latest application by created_at (adjust if you store multiple)
  const { data: applicationData, error: applicationError } = await supabase
    .from("applications")
    .select("id, full_name, email, parsed_resume, created_at")
    .eq("email", userEmail)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Pull the interview with the given interviewId
  const { data: interviewData, error: interviewError } = await supabase
    .from("interview")
    .select("id, name, objective, jd")
    .eq("id", interviewId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (applicationError || interviewError) {
    throw new Error(
      `Failed to fetch applications: ${
        (applicationError?.message ?? "") + (interviewError?.message ?? "")
      }`
    );
  }
  if (!applicationData?.id || !interviewData?.id) {
    throw new Error("No parsed_resume found for this email.");
  }

  const parsedResume = applicationData.parsed_resume;

  if (!interviewId) {
    throw new Error("interviewId is required");
  }

  let tailoredQuestions = [] as Array<{ question: string }>;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 5,
    dangerouslyAllowBrowser: true,
  });

  try {
    const baseCompletion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: generateQuestionsPrompt({
            name: interviewData.name,
            objective: interviewData.objective,
            number: numberOfTailoredQuestions,
            jdText: interviewData.jd,
            cvText: parsedResume,
          }),
        },
      ],
      response_format: { type: "json_object" },
    });

    const basePromptOutput = baseCompletion.choices[0] || {};

    tailoredQuestions =
      JSON.parse(basePromptOutput.message?.content ?? "").questions ?? [];

    logger.info("Interview questions generated successfully");
  } catch (error) {
    logger.error("Error generating interview questions");
  }
  if (!Array.isArray(tailoredQuestions) || tailoredQuestions.length === 0) {
    throw new Error("tailoredQuestions must be a non-empty array");
  }

  // Minimal validation on question objects
  const normalized = tailoredQuestions.map((q) => ({
    question: (q?.question ?? "").toString().trim(),
  }));
  if (normalized.some((q) => !q.question)) {
    throw new Error(
      "Each tailored question must have a non-empty 'question' string"
    );
  }

  const id = crypto.randomUUID();

  const { error: insertErr } = await supabase
    .from("interview_candidate")
    .insert({
      id,
      interview_id: interviewId,
      candidate_email: userEmail,
      candidate_name: applicationData.full_name ?? null,
      cv_ref: applicationData.id ?? null,
      tailored_questions: normalized, // JSONB column [{question:"..."}]
      created_at: new Date().toISOString(),
    });

  if (insertErr) {
    throw new Error(`Failed to save tailored questions: ${insertErr.message}`);
  }
}
