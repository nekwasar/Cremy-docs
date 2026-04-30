import { getAIConfig, getDefaultModel, getFallbackModel } from '@/lib/ai-config';
import { retry } from '@/lib/retry';
import type { Document } from '@/types/document';

interface GenerateOptions {
  prompt: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function generateAIDocument(options: GenerateOptions): Promise<string> {
  const config = await getAIConfig();
  if (!config) throw new Error('AI configuration not found');

  const response = await fetch(`${config.endpoint}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model || config.model,
      messages: [
        { role: 'system', content: options.systemPrompt || 'Generate a well-structured document in markdown format.' },
        { role: 'user', content: options.prompt },
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Generation failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function generateWithRetry(options: GenerateOptions): Promise<string> {
  return retry(() => generateAIDocument(options), {
    maxRetries: 2,
    delayMs: 1000,
    backoffMultiplier: 2,
  });
}

export function parseAIDocumentResponse(content: string, userId: string): Document {
  const sections = content.split('\n# ').filter(Boolean).map((section, index) => {
    const lines = section.split('\n');
    return {
      id: `section-${index}`,
      heading: lines[0].replace(/^#+\s*/, ''),
      content: lines.slice(1).join('\n'),
      order: index,
    };
  });

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return {
    id: `doc-${Date.now()}`,
    title: sections[0]?.heading || 'Untitled Document',
    content,
    format: 'markdown',
    sections,
    metadata: {
      wordCount,
      createdAt: new Date(),
      tone: 'professional',
    },
    userId,
    status: 'complete',
    versions: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
