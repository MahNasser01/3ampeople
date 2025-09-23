"use server";

import { generateCvTailoredQuestions } from "./generate-cv-tailored-questions";
import { logger } from "@/lib/logger";

export interface GenerateScreeningQuestionsParams {
  applicantId: string;
  userEmail: string;
  interviewId: string;
  numberOfQuestions?: number;
}

/**
 * Server action to generate tailored questions for a screening interview
 * This function will be called when sending a screening invite
 */
export async function generateScreeningQuestions({
  applicantId,
  userEmail,
  interviewId,
  numberOfQuestions = 5,
}: GenerateScreeningQuestionsParams) {
  try {
    logger.info(`Generating screening questions for applicant ${applicantId}`);

    // Generate tailored questions using the existing function
    await generateCvTailoredQuestions(
      interviewId,
      userEmail,
      numberOfQuestions,
    );

    logger.info(
      `Successfully generated ${numberOfQuestions} tailored questions for ${userEmail}`,
    );

    return {
      success: true,
      message: `Generated ${numberOfQuestions} tailored questions for screening interview`,
    };
  } catch (error) {
    logger.error(`Failed to generate screening questions: ${error}`);

    return {
      success: false,
      message: `Failed to generate screening questions: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
