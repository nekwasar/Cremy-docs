import { getAIConfig, validateAIConfig, getDefaultModel, getFallbackModel } from '@/lib/ai-config';
import type { Document, Section } from '@/types/document';

interface GenerationOptions {
  prompt: string;
  model?: string;
  onChunk?: (chunk: string) => void;
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateDocument(options: GenerationOptions): Promise<Document> {
  const config = await getAIConfig();
  
  if (!config || !(await validateAIConfig(config))) {
    throw new Error('AI configuration Invalid or missing');
  }

  const model = options.model || getDefaultModel();

  try {
    const response = await fetch(`${config.endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a professional document generator. Generate well-structured documents in markdown format.' },
          { role: 'user', content: options.prompt },
        ],
        stream: !!options.onChunk,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI API error: ${error}`);
    }

    if (options.onChunk && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed: AIResponse = JSON.parse(data);
              const content = parsed.choices?.[0]?.message?.content;
              if (content) {
                options.onChunk(content);
              }
            } catch {}
          }
        }
      }

      return parseDocument('');
    }

    const data: AIResponse = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    return parseDocument(content);
  } catch (error) {
    if (options.model) {
      throw error;
    }

    const fallbackConfig = await getAIConfig();
    if (!fallbackConfig) {
      throw error;
    }

    const fallbackResponse = await fetch(`${fallbackConfig.endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${fallbackConfig.apiKey}`,
      },
      body: JSON.stringify({
        model: getFallbackModel(),
        messages: [
          { role: 'system', content: 'You are a professional document generator.' },
          { role: 'user', content: options.prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    const fallbackData: AIResponse = await fallbackResponse.json();
    const fallbackContent = fallbackData.choices?.[0]?.message?.content || '';
    
    return parseDocument(fallbackContent);
  }
}

function parseDocument(content: string): Document {
  const sections: Section[] = [];
  const lines = content.split('\n');
  let currentSection: Section | null = null;
  let sectionOrder = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('# ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        id: `section-${sectionOrder}`,
        heading: trimmed.slice(2),
        content: '',
        order: sectionOrder,
      };
      sectionOrder++;
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  if (sections.length === 0) {
    sections.push({
      id: 'section-0',
      heading: 'Content',
      content: content,
      order: 0,
    });
  }

  const title = sections[0]?.heading || 'Untitled Document';
  const mainContent = sections.map(s => `# ${s.heading}\n\n${s.content}`).join('\n\n');

  return {
    id: `doc-${Date.now()}`,
    title,
    content: mainContent,
    format: 'markdown',
    sections,
    metadata: {
      wordCount: mainContent.split(/\s+/).filter(Boolean).length,
      createdAt: new Date(),
      tone: 'professional',
    },
    userId: '',
    status: 'complete',
    versions: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}