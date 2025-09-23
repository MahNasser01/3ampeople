import { NextRequest, NextResponse } from "next/server";
import { generateScreeningQuestions } from "@/actions/generate-screening-questions";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicantId, userEmail, interviewId, numberOfQuestions } = body;

    // Validate required fields
    if (!applicantId || !userEmail || !interviewId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: applicantId, userEmail, and interviewId are required",
        },
        { status: 400 },
      );
    }

    logger.info(
      `API: Generating screening questions for applicant ${applicantId}`,
    );

    // Call the server action to generate tailored questions
    const result = await generateScreeningQuestions({
      applicantId,
      userEmail,
      interviewId,
      numberOfQuestions: numberOfQuestions || 5,
    });

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    logger.error(`API: Error generating screening questions: ${error}`);

    return NextResponse.json(
      {
        success: false,
        message: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
