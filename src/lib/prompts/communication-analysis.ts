export const SYSTEM_PROMPT = `You are an expert in analyzing communication skills from interview transcripts. Your task is to:
1. Analyze the communication skills demonstrated in the transcript
2. Identify specific quotes that support your analysis
3. Provide a detailed breakdown of strengths and areas for improvement`;

export const getCommunicationAnalysisPrompt = (
  transcript: string,
) => `Analyze the communication skills demonstrated in the following interview transcript.

Transcript:
${transcript}

TASK
- Evaluate verbal clarity, tone, listening, conciseness, professionalism, and adaptability.
- Assign a "communicationScore" from 0–10 (higher = better).
- Provide overall feedback: 2–3 sentences.
- Identify supporting quotes (<= 25 words each) with brief analysis, marking them as "strength" or "improvement_area".
- List distinct "strengths" and "improvementAreas" in plain, actionable language.

SPARC DIMENSION
This analysis corresponds to the SPARC dimension "postureCommunication".
Optionally include a "sparc_breakdown" field: { "dim": "postureCommunication", "score": X, "rationale": "..." }

OUTPUT FORMAT (STRICT JSON)
{
  "communicationScore": number,        // 0–10
  "overallFeedback": string,           // 2–3 sentence summary
  "supportingQuotes": [
    {
      "quote": string,                 // exact transcript text (<= 25 words)
      "analysis": string,              // short analysis
      "type": "strength" | "improvement_area"
    }
  ],
  "strengths": [string],               // key strengths in plain language
  "improvementAreas": [string],        // improvement opportunities
  "sparc_dimension": "postureCommunication",
  "sparc_breakdown": {
    "dim": "postureCommunication",
    "score": number,                   // same scale, 0–10
    "rationale": string                // 1–2 sentence explanation
  }
}

CONSTRAINTS
- Always return valid JSON.
- "sparc_dimension" and "sparc_breakdown" are OPTIONAL; omit if not needed.
- Keep all strings concise and actionable.`
;
