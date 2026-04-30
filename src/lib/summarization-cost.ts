export function calculateSummarizationCost(originalWordCount: number): number {
  const WORDS_PER_CREDIT = 100;
  return Math.max(1, Math.ceil(originalWordCount / WORDS_PER_CREDIT));
}

export function estimateSummarizationCost(text: string): {
  wordCount: number;
  creditCost: number;
} {
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  return {
    wordCount,
    creditCost: calculateSummarizationCost(wordCount),
  };
}
