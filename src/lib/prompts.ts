export function assessmentPrompt(profile: string, roleTitle: string, company: string, jobDescription: string): string {
  return `You are a senior recruitment assessor for IT procurement roles. Compare the
candidate profile against the job description and respond with ONLY a JSON
object, no other text:
{"fit_score": 0-100, "tier": "A"|"B"|"C",
 "verdict": "one sentence: apply / apply with adjustments / skip",
 "strengths": ["3-5 strongest matches"],
 "gaps": ["2-4 gaps, each with a one-phrase mitigation"],
 "keywords": ["6-10 ATS keywords from the job description the CV must contain"]}
Tier A = 80+, B = 60-79, C = below 60. Be brutally honest; do not inflate the score.

CANDIDATE PROFILE:
${profile}

JOB DESCRIPTION (${roleTitle} at ${company}):
${jobDescription}`;
}

export function cvPrompt(profile: string, roleTitle: string, company: string, jobDescription: string, keywords: string[]): string {
  return `Write in formal British English. Never use contractions: write "do not" instead
of "don't", "it is" instead of "it's". Rewrite the candidate's experience as 7
CV bullet points tailored precisely to this job description, weaving in these ATS
keywords where truthful: ${keywords.join(", ")}. Each bullet must start with a strong verb
and include scale or impact where the profile supports it. Never invent facts.
Respond with ONLY a JSON array of strings.

CANDIDATE PROFILE:
${profile}

JOB DESCRIPTION (${roleTitle} at ${company}):
${jobDescription}`;
}

export function coverPrompt(profile: string, candidateName: string, roleTitle: string, company: string, jobDescription: string): string {
  return `Write in formal British English. Never use contractions. Draft a concise cover
email of 170 to 220 words for ${roleTitle} at ${company}, from ${candidateName}.
Structure: a one-line hook tied to the company's context; two short paragraphs
evidencing fit with concrete achievements from the profile; a confident close
requesting a conversation. Put the subject line on the first line as
"Subject: ...". Respond with the email text only.

CANDIDATE PROFILE:
${profile}

JOB DESCRIPTION:
${jobDescription}`;
}
