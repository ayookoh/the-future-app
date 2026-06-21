import crypto from "node:crypto";

export type NormalisedRole = {
  source: string;
  sourceId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string | null;
  postedAt?: Date | null;
  firstPassScore: number;
  dedupeHash: string;
};

export function makeDedupeHash(company: string, title: string, location: string): string {
  return crypto
    .createHash("sha256")
    .update(`${company}|${title}|${location}`.toLowerCase().replace(/\s+/g, " ").trim())
    .digest("hex");
}

export function scoreRole(description: string, profile: string, targetTitles: string[]): number {
  const haystack = `${description} ${targetTitles.join(" ")}`.toLowerCase();
  const profileWords = new Set(
    profile
      .toLowerCase()
      .replace(/[^a-z0-9À-ÿ\s-]/gi, " ")
      .split(/\s+/)
      .filter((word) => word.length > 4)
  );
  const priority = ["procurement", "category", "sourcing", "vendor", "supplier", "software", "saas", "cloud", "it", "risk", "contract", "licence"];
  let score = 0;
  for (const word of priority) if (haystack.includes(word)) score += 6;
  for (const word of profileWords) if (haystack.includes(word)) score += 1;
  return Math.min(100, score);
}

export function safeJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}
