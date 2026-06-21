const importantTerms = [
  "procurement", "sourcing", "category", "it", "software", "saas", "cloud",
  "telecom", "vendor", "supplier", "risk", "contract", "negotiation",
  "dora", "gdpr", "outsourcing", "licence", "licensing", "stakeholder"
];

export function firstPassScore(profile: string, description: string): number {
  const haystack = `${profile} ${description}`.toLowerCase();
  const roleText = description.toLowerCase();
  let score = 0;

  for (const term of importantTerms) {
    if (roleText.includes(term)) score += 6;
    if (haystack.includes(term)) score += 2;
  }

  return Math.min(100, score);
}
