export const SYSTEM_PROMPT =
  "You are an expert in uncovering deeper insights from interview question and answer sets.";

export const createUserPrompt = (
  callSummaries: string,
  interviewName: string,
  interviewObjective: string,
  interviewDescription: string,
  jdText?: string,
  cvText?: string,
  pastNotes?: string
) => {
  return `You are an interviewer who is an expert in uncovering deeper insights from interview call summaries.

###
Call Summaries:
${callSummaries}

###
Interview Title: ${interviewName}
Interview Objective: ${interviewObjective}
Interview Description: ${interviewDescription}
Job Description (optional): ${jdText ?? "N/A"}
Candidate CV (optional): ${cvText ?? "N/A"}
Past Interview Notes (optional): ${pastNotes ?? "N/A"}

TASK
- Generate exactly 3 insights that highlight candidate feedback, concerns, or motivations.
- Each insight must be <= 25 words.
- Do NOT include candidate names or identifiers.
- Prefer actionable language (“Candidate values…”, “Candidate expressed concern about…”).
- Use JD/CV context only to sharpen relevance.

OPTIONAL SPARC HINTS
If possible, tag insights with relevant SPARC dimensions:
- growthMindset
- businessThinking
- criticalThinking
- postureCommunication
- aiLiteracy
- techDepth (only if JD is technical)

OUTPUT FORMAT (STRICT JSON)
{
  "insights": ["...", "...", "..."],
  "sparc_highlights": [
    { "insightIndex": 0, "dims": ["criticalThinking"] },
    { "insightIndex": 2, "dims": ["growthMindset","businessThinking"] }
  ],
  "themes": ["compensation","career growth"]
}

CONSTRAINTS
- "insights" is REQUIRED and must always be an array of exactly 3 strings (backwards compatible).
- "sparc_highlights" and "themes" are OPTIONAL; omit if no clear mapping.
- Keep JSON valid and nothing else in output.`
;
};
