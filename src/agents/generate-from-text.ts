import { generateDocument } from '@/lib/ai-generation';
import { buildGeneratePrompt } from '@/lib/prompt-builder';
import { saveDocument } from '@/lib/document-save';
import { countWords } from '@/lib/word-count';

interface GenerateTextInput {
  text: string;
  userId: string;
  templateId?: string;
  format?: string;
  tone?: string;
}

interface GenerateTextOutput {
  success: boolean;
  documentId?: string;
  preview?: string;
  wordCount: number;
  error?: string;
}

export async function handleGenerateFromText(input: GenerateTextInput): Promise<GenerateTextOutput> {
  try {
    const prompt = buildGeneratePrompt({
      text: input.text,
      tone: input.tone,
      format: input.format,
    });

    const document = await generateDocument({ prompt });
    document.userId = input.userId;

    const wordCount = countWords(document.content);
    const docId = await saveDocument(input.userId, document, input.templateId);

    return {
      success: true,
      documentId: docId,
      preview: document.content.slice(0, 1000),
      wordCount,
    };
  } catch (error: any) {
    return { success: false, wordCount: 0, error: error.message };
  }
}
