import { generateDocument } from '@/lib/ai-generation';
import { autoDetectFormat, getAutoDetectPrompt } from '@/lib/auto-detect';
import { saveDocument } from '@/lib/document-save';
import { countWords } from '@/lib/word-count';

interface GenerateCommandInput {
  command: string;
  userId: string;
  format?: string;
  tone?: string;
}

interface GenerateCommandOutput {
  success: boolean;
  documentId?: string;
  preview?: string;
  detectedFormat?: string;
  wordCount: number;
  error?: string;
}

export async function handleGenerateFromCommand(input: GenerateCommandInput): Promise<GenerateCommandOutput> {
  try {
    const detected = autoDetectFormat(input.command);
    const autoPrompt = getAutoDetectPrompt(input.command, detected);

    let prompt = `Generate a document based on this command: "${input.command}"\n\n`;
    prompt += autoPrompt;
    if (input.tone) prompt += `\nTone: ${input.tone}`;

    const document = await generateDocument({ prompt });
    document.userId = input.userId;

    const wordCount = countWords(document.content);
    const docId = await saveDocument(input.userId, document);

    return {
      success: true,
      documentId: docId,
      preview: document.content.slice(0, 1000),
      detectedFormat: detected.formatType,
      wordCount,
    };
  } catch (error: any) {
    return { success: false, wordCount: 0, error: error.message };
  }
}
