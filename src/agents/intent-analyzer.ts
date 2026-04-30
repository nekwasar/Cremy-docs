type ToolIntent =
  | 'generate_text'
  | 'generate_command'
  | 'edit'
  | 'convert'
  | 'translate'
  | 'voice'
  | 'extract'
  | 'merge'
  | 'split'
  | 'compress'
  | 'change_style';

interface IntentResult {
  label: string;
  id: ToolIntent;
  confidence: number;
}

interface IntentAnalysis {
  primary: IntentResult;
  all: IntentResult[];
  needsClarification: boolean;
  isAmbiguous: boolean;
}

const INTENT_PATTERNS: Array<{ keywords: string[]; id: ToolIntent; label: string }> = [
  { keywords: ['generate', 'create', 'make', 'write', 'draft', 'produce', 'compose', 'build'], id: 'generate_command', label: 'Generate from Command' },
  { keywords: ['format', 'structure', 'reformat', 'apply template', 'use format'], id: 'generate_text', label: 'Generate from Text' },
  { keywords: ['edit', 'change', 'modify', 'update', 'revise', 'fix', 'correct', 'adjust', 'improve', 'enhance', 'rewrite', 'rephrase'], id: 'edit', label: 'Edit Document' },
  { keywords: ['convert', 'change format', 'to pdf', 'to docx', 'to word', 'to excel', 'to image', 'transform'], id: 'convert', label: 'Convert File' },
  { keywords: ['translate', 'spanish', 'french', 'german', 'japanese', 'chinese', 'language'], id: 'translate', label: 'Translate' },
  { keywords: ['voice', 'record', 'speak', 'transcribe', 'audio', 'dictate', 'speech'], id: 'voice', label: 'Voice to Document' },
  { keywords: ['extract', 'ocr', 'text from', 'read text', 'pull text', 'scan', 'recognize text'], id: 'extract', label: 'Extract Text (OCR)' },
  { keywords: ['merge', 'combine', 'join', 'put together', 'into one'], id: 'merge', label: 'Merge Files' },
  { keywords: ['split', 'separate', 'divide', 'break apart', 'extract pages'], id: 'split', label: 'Split File' },
  { keywords: ['compress', 'reduce size', 'smaller', 'shrink', 'optimize', 'minimize'], id: 'compress', label: 'Compress File' },
  { keywords: ['style', 'change look', 'design', 'theme', 'appearance', 'reformat', 'restyle'], id: 'change_style', label: 'Change Style' },
];

const AMBIGUITY_MAP: Record<string, ToolIntent[]> = {
  'make shorter': ['compress', 'edit'],
  'shrink': ['compress', 'change_style'],
  'change': ['edit', 'change_style', 'convert'],
  'restyle': ['change_style', 'edit', 'generate_text'],
};

export function analyzeIntent(message: string): IntentAnalysis {
  const lower = message.toLowerCase();

  for (const [phrase, tools] of Object.entries(AMBIGUITY_MAP)) {
    if (lower.includes(phrase)) {
      const all = tools.map((id) => {
        const pattern = INTENT_PATTERNS.find((p) => p.id === id)!;
        return { label: pattern.label, id, confidence: 0.7 / tools.length };
      });

      return {
        primary: all[0],
        all,
        needsClarification: true,
        isAmbiguous: true,
      };
    }
  }

  const matches: IntentResult[] = [];
  for (const pattern of INTENT_PATTERNS) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (lower.includes(keyword)) {
        score += 1 / pattern.keywords.length;
      }
    }
    if (score > 0) {
      matches.push({ label: pattern.label, id: pattern.id, confidence: score });
    }
  }

  matches.sort((a, b) => b.confidence - a.confidence);

  if (matches.length === 0) {
    const defaultResult = { label: 'Generate from Command', id: 'generate_command' as ToolIntent, confidence: 0.3 };
    return {
      primary: defaultResult,
      all: [defaultResult],
      needsClarification: true,
      isAmbiguous: true,
    };
  }

  const primary = matches[0];
  const isAmbiguous = matches.length > 1 && matches[1].confidence > primary.confidence * 0.7;

  return {
    primary,
    all: matches,
    needsClarification: isAmbiguous,
    isAmbiguous,
  };
}
