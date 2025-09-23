export const SYSTEM_PROMPT =
  "You are an expert in analyzing interview transcripts. You must only use the main questions provided and not generate or infer additional questions.";

export const getInterviewAnalyticsPrompt = (
  interviewTranscript: string,
  mainInterviewQuestions: string,
) => `Analyse the following interview transcript and provide structured feedback.

###
Transcript:
${interviewTranscript}

###
Main Interview Questions:
${mainInterviewQuestions}

TASKS
1. Overall Score (0–100) and Overall Feedback (≤ 60 words).
   Factors: communication, response time, confidence, clarity, attitude, relevance, knowledge depth, problem-solving, use of examples, listening, consistency, adaptability.
2. Communication Skills: Score (0–10) and Feedback (≤ 60 words).
   Rating system: 10 (fully operational) down to 01 (did not answer). Use the provided rubric.
3. Question Summaries: For EACH main question:
   - If not found in transcript → "Not Asked".
   - If found but no answer → "Not Answered".
   - If found with answer → cohesive paragraph including candidate’s response and follow-ups (if any).
   Always output every provided main question with its number intact.
4. Soft Skill Summary: One sentence, 10–15 words, covering confidence, leadership, adaptability, critical thinking, decision making.

SPARC DIMENSIONS
Additionally, attempt to map interview performance to SPARC:
- growthMindset
- businessThinking
- criticalThinking
- postureCommunication
- aiLiteracy
- techDepth (only if JD is technical)

OUTPUT FORMAT (STRICT JSON)
{
  "overallScore": number,
  "overallFeedback": string,
  "communication": {
    "score": number,
    "feedback": string
  },
  "questionSummaries": [
    { "question": string, "summary": string },
    ...
  ],
  "softSkillSummary": string,
  "sparc_breakdown": [
    { "dim": "growthMindset", "score": number, "rationale": string },
    { "dim": "businessThinking", "score": number, "rationale": string },
    ...
  ],
  "fitScore": number
}

CONSTRAINTS
- Always include: overallScore, overallFeedback, communication, questionSummaries, softSkillSummary.
- "sparc_breakdown" and "fitScore" are OPTIONAL (omit if not applicable).
- "sparc_breakdown" items: each has dim, score (0–10), rationale (1–2 sentences).
- "fitScore": 1–10 integer overall verdict.
- JSON only, no additional text.`
;
