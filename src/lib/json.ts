export function parseModelJson<T>(raw: string): T {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const objectStart = cleaned.indexOf("{");
  const arrayStart = cleaned.indexOf("[");
  const starts = [objectStart, arrayStart].filter((n) => n >= 0);
  if (!starts.length) throw new Error("No JSON object or array found in model response.");

  const start = Math.min(...starts);
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  if (end <= start) throw new Error("Malformed JSON returned by model.");

  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}
