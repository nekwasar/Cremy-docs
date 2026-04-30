const COST_RATES: Record<string, { perUnit: number; unit: string }> = {
  generate_command: { perUnit: 100, unit: 'words' },
  generate_text: { perUnit: 100, unit: 'words' },
  edit: { perUnit: 10, unit: 'edits' },
  translate: { perUnit: 50, unit: 'words' },
  voice: { perUnit: 100, unit: 'words' },
  extract: { perUnit: 50, unit: 'words' },
  change_style: { perUnit: 100, unit: 'words' },
  convert: { perUnit: 0, unit: 'conversions' },
  merge: { perUnit: 0, unit: 'merges' },
  split: { perUnit: 0, unit: 'splits' },
  compress: { perUnit: 0, unit: 'compressions' },
};

export function calculateCredits(toolId: string, input: string): number {
  const rate = COST_RATES[toolId];
  if (!rate || rate.perUnit === 0) return 0;

  const words = input.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / rate.perUnit));
}

export function estimateAllCosts(input: string): Record<string, number> {
  const costs: Record<string, number> = {};
  for (const toolId of Object.keys(COST_RATES)) {
    costs[toolId] = calculateCredits(toolId, input);
  }
  return costs;
}

export function isFreeTool(toolId: string): boolean {
  const rate = COST_RATES[toolId];
  return !rate || rate.perUnit === 0;
}
