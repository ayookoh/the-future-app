import { env } from "./env";
import { fetchWithTimeout } from "./http";

export async function callModel(prompt: string, timeoutMs = 30000): Promise<string> {
  const provider = env("LLM_PROVIDER");
  const model = env("LLM_MODEL");

  if (provider === "openai") {
    const response = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env("OPENAI_API_KEY")}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      })
    }, timeoutMs);
    const json = await response.json();
    return json.choices?.[0]?.message?.content ?? "";
  }

  if (provider === "anthropic") {
    const response = await fetchWithTimeout("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env("ANTHROPIC_API_KEY"),
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model,
        max_tokens: 1600,
        messages: [{ role: "user", content: prompt }]
      })
    }, timeoutMs);
    const json = await response.json();
    return json.content?.map((part: { text?: string }) => part.text ?? "").join("") ?? "";
  }

  throw new Error("LLM_PROVIDER must be set to openai or anthropic.");
}
