const contractionPatterns = [
  /\b\w+n't\b/i,
  /\b(?:I|you|we|they|he|she|it|that|there|here|who|what|where|when|why|how)'(?:m|re|ve|ll|d|s)\b/i,
  /\b(?:can|won|shan)'t\b/i
];

export function findContractions(text: string): string[] {
  const matches = new Set<string>();
  for (const pattern of contractionPatterns) {
    for (const match of text.matchAll(new RegExp(pattern.source, "gi"))) {
      matches.add(match[0]);
    }
  }
  return [...matches];
}

export function assertNoContractions(text: string): void {
  const contractions = findContractions(text);
  if (contractions.length) {
    throw new Error(`Generated text contains contractions: ${contractions.join(", ")}`);
  }
}
