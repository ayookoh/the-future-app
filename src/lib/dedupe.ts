import crypto from "node:crypto";

export function roleDedupeHash(company: string, title: string, location: string): string {
  return crypto
    .createHash("sha256")
    .update(`${company}|${title}|${location}`.toLowerCase().replace(/\s+/g, " ").trim())
    .digest("hex");
}
