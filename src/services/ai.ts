import { getAIConfig, validateAIConfig } from '@/lib/ai-config';

export async function validateAIConnection(): Promise<boolean> {
  const config = await getAIConfig();
  if (!config) return false;
  return validateAIConfig(config);
}

export async function makeAIRequest(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  } = {}
): Promise<string> {
  const config = await getAIConfig();
  if (!config) {
    throw new Error('AI configuration not found');
  }

  const response = await fetch(`${config.endpoint}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model || config.model,
      messages: [
        { role: 'system', content: options.systemPrompt || 'You are a professional document assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
