import { generateDocument } from '@/lib/ai-generation';
import { buildGeneratePrompt } from '@/lib/prompt-builder';
import { calculatePreviewCost } from '@/lib/credit-cost';
import type { Document } from '@/types/document';

interface PreviewOptions {
  text: string;
  formatId?: string;
  tone?: string;
  templateId?: string;
}

interface PreviewResult {
  document: Document;
  creditCost: number;
  isPreview: boolean;
}

export async function generatePreview(options: PreviewOptions): Promise<PreviewResult> {
  const prompt = buildGeneratePrompt({
    text: options.text,
    tone: options.tone,
    format: options.formatId,
  });

  const document = await generateDocument({
    prompt,
    onChunk: (chunk) => {
      console.log('Preview chunk generated');
    },
  });

  const cost = calculatePreviewCost(document.metadata.wordCount);

  return {
    document,
    creditCost: cost,
    isPreview: true,
  };
}