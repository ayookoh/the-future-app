import { env } from "./env";
import { fetchWithTimeout } from "./http";
import { parseModelJson } from "./json";
import { assertNoContractions } from "./validators";

export type FitAssessment = {
  fit_score: number;
  tier: "A" | "B" | "C";
  verdict: string;
  strengths: string[];
  gaps: string[];
  keywords: string[];
};

export async function callModel(prompt: string, timeoutMs = 30000): Promise<string> {
  const provider = env("LLM_PROVIDER");
  const model = env("LLM_MODEL");

  if (provider === "openai") {
    const response = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env("OPENAI_API_KEY")}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.2 })
    }, timeoutMs);
    const json = await response.json();
    return json.choices?.[0]?.message?.content ?? "";
  }

  if (provider === "anthropic") {
    const response = await fetchWithTimeout("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": env("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 1800, temperature: 0.2, messages: [{ role: "user", content: prompt }] })
    }, timeoutMs);
    const json = await response.json();
    return json.content?.map((part: { text?: string }) => part.text ?? "").join("") ?? "";
  }

  throw new Error("LLM_PROVIDER must be set to openai or anthropic.");
}

export async function assessFit(profile: string, roleTitle: string, company: string, jobDescription: string): Promise<FitAssessment> {
  const prompt = `You are a senior recruitment assessor for IT procurement roles. Compare the candidate profile against the job description. Return only JSON with this shape: {"fit_score": 0, "tier": "A", "verdict": "one sentence", "strengths": [], "gaps": [], "keywords": []}. Tier A is 80 or above, B is 60 to 79, and C is below 60. Be strict and do not inflate the score.\n\nCANDIDATE PROFILE:\n${profile}\n\nJOB DESCRIPTION (${roleTitle} at ${company}):\n${jobDescription}`;
  return parseModelJson<FitAssessment>(await callModel(prompt, 30000));
}

export async function tailorCv(profile: string, roleTitle: string, company: string, jobDescription: string, keywords: string[]): Promise<string[]> {
  const prompt = `Write in formal British English. Never use contractions. Rewrite the candidate experience as seven CV bullet points tailored to this job description. Use these ATS keywords where truthful: ${keywords.join(", ")}. Each bullet must start with a strong verb and include scale or impact where the profile supports it. Never invent facts. Return only a JSON array of strings.\n\nCANDIDATE PROFILE:\n${profile}\n\nJOB DESCRIPTION (${roleTitle} at ${company}):\n${jobDescription}`;
  const bullets = parseModelJson<string[]>(await callModel(prompt, 60000));
  bullets.forEach(assertNoContractions);
  return bullets;
}

export async function draftCoverEmail(profile: string, candidateName: string, roleTitle: string, company: string, jobDescription: string): Promise<string> {
  const prompt = `Write in formal British English. Never use contractions. Draft a concise cover email of 170 to 220 words for ${roleTitle} at ${company}, from ${candidateName}. Put the subject line on the first line as Subject:. Use two short paragraphs with concrete achievements from the profile and close by requesting a conversation.\n\nCANDIDATE PROFILE:\n${profile}\n\nJOB DESCRIPTION:\n${jobDescription}`;
  const email = await callModel(prompt, 60000);
  assertNoContractions(email);
  return email;
}
