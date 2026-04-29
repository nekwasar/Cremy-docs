interface ToneSettings {
  tone: string;
  description: string;
}

const TONE_MAPPINGS: Record<string, ToneSettings> = {
  professional: { tone: 'professional', description: 'Formal, business-appropriate language' },
  casual: { tone: 'casual', description: 'Relaxed, friendly tone' },
  academic: { tone: 'academic', description: 'Scholarly, research-focused language' },
  legal: { tone: 'legal', description: 'Precise, legally-appropriate terminology' },
  technical: { tone: 'technical', description: 'Technical and precise language' },
  creative: { tone: 'creative', description: 'Expressive and imaginative tone' },
};

export function getTone(toneName: string): ToneSettings | null {
  return TONE_MAPPINGS[toneName] || null;
}

export function applyTone(toneName: string): string {
  const tone = getTone(toneName);
  if (!tone) {
    return '';
  }
  return `Write in a ${tone.tone} tone: ${tone.description}`;
}

export function getAvailableTones(): string[] {
  return Object.keys(TONE_MAPPINGS);
}