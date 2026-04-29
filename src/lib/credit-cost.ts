const BASE_COST = 1;
const WORD_COUNT_MULTIPLIER = 0.001;
const TEMPLATE_PREMIUM = 1.5;

export function calculateCreditCost(wordCount: number, isTemplate: boolean = false): number {
  let cost = BASE_COST;
  
  cost += wordCount * WORD_COUNT_MULTIPLIER;
  
  if (isTemplate) {
    cost *= TEMPLATE_PREMIUM;
  }
  
  return Math.ceil(cost);
}

export function calculatePreviewCost(cost: number): number {
  return Math.ceil(cost * 0.5);
}