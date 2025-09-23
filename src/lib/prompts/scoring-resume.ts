export const getScoringResumePrompt = (
  resumeText: string,
  jobPosition: string,
) => `Given the resume text below and the target job position "${jobPosition}", provide a single integer score from 0 to 10 indicating suitability. Consider relevant skills, experience, and education. Only return the number.

Resume:
${resumeText}`;