import { logger } from "@/lib/logger";
import { InterviewerService } from "@/services/interviewers.service";
import { NextResponse, NextRequest } from "next/server";
import Retell from "retell-sdk";
import { INTERVIEWERS, RETELL_AGENT_GENERAL_PROMPT } from "@/lib/constants";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function GET(res: NextRequest) {
  logger.info("create-interviewer request received");

  try {
    // Get existing agents
    const existingAgents = await retellClient.agent.list(); // adjust based on actual API
    const existingAgentNames = existingAgents.map((a: any) => a.agent_name);

    // Create model
    const newModel = await retellClient.llm.create({
      model: "gpt-5",
      general_prompt: RETELL_AGENT_GENERAL_PROMPT,
      general_tools: [
        {
          type: "end_call",
          name: "end_call_1",
          description:
            "Automatically terminate the call when the elapsed time reaches or exceeds {{END_TIME}}, calculated from the initial start time of {{CURRENT_TIME}}",
        },
      ],
    });

    const response: any = {};

    // Helper function to create agent if not exists
    const createAgentIfNotExists = async (agentName: string, voiceId: string, interviewerData: any) => {
      if (existingAgentNames.includes(agentName)) {
        logger.info(`Agent "${agentName}" already exists. Skipping creation.`);
        return null;
      }

      const agent = await retellClient.agent.create({
        response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
        voice_id: voiceId,
        agent_name: agentName,
      });

      const interviewer = await InterviewerService.createInterviewer({
        agent_id: agent.agent_id,
        ...interviewerData,
      });

      return interviewer;
    };

    // Create Alaa
    response.newInterviewer = await createAgentIfNotExists("Alaa", "11labs-Chloe", INTERVIEWERS.LISA);

    // Create Noman
    response.newSecondInterviewer = await createAgentIfNotExists("Noman", "11labs-Brian", INTERVIEWERS.BOB);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger.error("Error creating interviewers:", error);

    return NextResponse.json(
      { error: "Failed to create interviewers" },
      { status: 500 }
    );
  }
}
