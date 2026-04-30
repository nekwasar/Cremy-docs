export interface FormatCreditCost {
  formatId: string;
  baseCost: number;
  perWordRate: number;
  minCost: number;
  maxCost: number;
}

export const FORMAT_CREDIT_COSTS: Record<string, FormatCreditCost> = {
  invoice: { formatId: 'invoice', baseCost: 2, perWordRate: 0.01, minCost: 3, maxCost: 10 },
  contract: { formatId: 'contract', baseCost: 3, perWordRate: 0.01, minCost: 5, maxCost: 15 },
  proposal: { formatId: 'proposal', baseCost: 2, perWordRate: 0.01, minCost: 4, maxCost: 12 },
  report: { formatId: 'report', baseCost: 2, perWordRate: 0.01, minCost: 4, maxCost: 12 },
  memo: { formatId: 'memo', baseCost: 1, perWordRate: 0.01, minCost: 2, maxCost: 6 },
  essay: { formatId: 'essay', baseCost: 2, perWordRate: 0.01, minCost: 4, maxCost: 12 },
  'research-paper': { formatId: 'research-paper', baseCost: 4, perWordRate: 0.01, minCost: 6, maxCost: 20 },
  thesis: { formatId: 'thesis', baseCost: 5, perWordRate: 0.01, minCost: 8, maxCost: 25 },
  summary: { formatId: 'summary', baseCost: 1, perWordRate: 0.01, minCost: 2, maxCost: 5 },
  nda: { formatId: 'nda', baseCost: 2, perWordRate: 0.01, minCost: 4, maxCost: 10 },
  agreement: { formatId: 'agreement', baseCost: 3, perWordRate: 0.01, minCost: 5, maxCost: 15 },
  letter: { formatId: 'letter', baseCost: 1, perWordRate: 0.01, minCost: 2, maxCost: 6 },
  resume: { formatId: 'resume', baseCost: 2, perWordRate: 0.01, minCost: 3, maxCost: 8 },
  'cover-letter': { formatId: 'cover-letter', baseCost: 1, perWordRate: 0.01, minCost: 2, maxCost: 6 },
  cv: { formatId: 'cv', baseCost: 3, perWordRate: 0.01, minCost: 4, maxCost: 12 },
  story: { formatId: 'story', baseCost: 3, perWordRate: 0.01, minCost: 5, maxCost: 15 },
  'blog-post': { formatId: 'blog-post', baseCost: 2, perWordRate: 0.01, minCost: 3, maxCost: 10 },
  newsletter: { formatId: 'newsletter', baseCost: 2, perWordRate: 0.01, minCost: 3, maxCost: 8 },
};

export function getFormatCreditCost(formatId: string): FormatCreditCost | undefined {
  return FORMAT_CREDIT_COSTS[formatId];
}

export function getDefaultFormatCost(): FormatCreditCost {
  return { formatId: 'default', baseCost: 1, perWordRate: 0.01, minCost: 1, maxCost: 10 };
}

export function calculateFormatCost(formatId: string, wordCount: number): number {
  const cost = getFormatCreditCost(formatId) || getDefaultFormatCost();
  const calculated = cost.baseCost + wordCount * cost.perWordRate;
  return Math.max(cost.minCost, Math.min(cost.maxCost, Math.ceil(calculated)));
}

export function getAllFormatCosts(): Record<string, FormatCreditCost> {
  return FORMAT_CREDIT_COSTS;
}