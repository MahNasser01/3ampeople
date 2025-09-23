import { logger } from "@/lib/logger";
import { InterviewerService } from "@/services/interviewers.service";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import Retell from "retell-sdk";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

const supabase = createClientComponentClient();
export async function POST(req: Request, res: Response) {
  logger.info("register-call request received");

  const body = await req.json();

  const interviewerId = body.interviewer_id;
  const interviewer = await InterviewerService.getInterviewer(interviewerId);

  const questions = body.dynamic_data.questions;

  const { data, error } = await supabase
    .from("interview_candidate")
    .select("id, created_at, tailored_questions")
    .eq("interview_id", body.dynamic_data.interview_id)
    .eq("candidate_email", body.dynamic_data.email)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  // Flatten + de-dup to array<string>
  const allQuestions = [
    ...Array.from(
      new Set(
        (data ?? [])
          .flatMap((r) =>
            Array.isArray(r.tailored_questions) ? r.tailored_questions : []
          )
          .map((q) => (q?.question ?? "").toString().trim())
          .filter(Boolean)
      )
    ),
    ...questions,
  ];

  const registerCallResponse = await retellClient.call.createWebCall({
    agent_id: interviewer?.agent_id,
    retell_llm_dynamic_variables: {
      ...body.dynamic_data,
      questions: allQuestions.join(", "),
    },
  });

  logger.info("Call registered successfully");

  return NextResponse.json(
    {
      registerCallResponse,
    },
    { status: 200 }
  );
}
