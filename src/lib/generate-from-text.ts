import { countWords } from './word-count';
import { calculateCreditCost } from './credit-cost';
import { validateInput } from './input-validation';
import { buildGeneratePrompt } from './prompt-builder';
import { generateDocument } from './ai-generation';
import { saveDocument } from './document-save';
import type { Document } from '@/types/document';

interface GenerateFromTextOptions {
  text: string;
  userId: string;
  templateId?: string;
  formatId?: string;
  tone?: string;
}

interface GenerateResult {
  success: boolean;
  document?: Document;
  documentId?: string;
  wordCount: number;
  creditCost: number;
  error?: string;
}

export async function generateFromText(options: GenerateFromTextOptions): Promise<GenerateResult> {
  const validation = validateInput(options.text);
  if (!validation.valid) {
    return { success: false, wordCount: 0, creditCost: 0, error: validation.errors.join(', ') };
  }

  const wordCount = countWords(options.text);
  const creditCost = calculateCreditCost(wordCount, !!options.templateId);

  const prompt = buildGeneratePrompt({
    text: options.text,
    tone: options.tone,
    format: options.formatId,
  });

  try {
    const document = await generateDocument({ prompt });
    document.userId = options.userId;
    document.metadata.wordCount = wordCount;
    document.metadata.tone = options.tone || 'professional';

    const savedId = await saveDocument(options.userId, document, options.templateId);

    return {
      success: true,
      document,
      documentId: savedId,
      wordCount,
      creditCost,
    };
  } catch (error) {
    return {
      success: false,
      wordCount,
      creditCost,
      error: error instanceof Error ? error.message : 'Generation failed',
    };
  }
}

export function calculateRequiredCredits(text: string, hasTemplate: boolean = false): number {
  const wordCount = countWords(text);
  return calculateCreditCost(wordCount, hasTemplate);
}