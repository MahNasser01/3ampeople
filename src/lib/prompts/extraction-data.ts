export const getExtractionDataPrompt = (
  resumeText: string,
) => `Extract the following structured JSON from the provided resume text.
Return strictly valid JSON with keys: skills (string[]), experience (Array<{company:string, role:string, start?:string, end?:string, details?:string[]}>), projects (Array<{name:string, description?:string, tech?:string[]}>), education (Array<{institution:string, degree?:string, start?:string, end?:string}>), certifications (string[]), summary (string).

Resume:
${resumeText}`;