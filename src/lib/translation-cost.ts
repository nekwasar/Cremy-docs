export function calculateTranslationCost(wordCount: number): number {
  const WORDS_PER_CREDIT = 50;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_CREDIT));
}

export function estimateTranslationCost(text: string): {
  wordCount: number;
  creditCost: number;
} {
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  return {
    wordCount,
    creditCost: calculateTranslationCost(wordCount),
  };
}