interface ParsedResponse {
  type: 'intent' | 'tool_selection' | 'clarification' | 'execution' | 'output';
  data: Record<string, unknown>;
  confidence: number;
}

export function parseAgentResponse(raw: string): ParsedResponse {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      if (parsed.intent) {
        return { type: 'intent', data: parsed, confidence: parsed.confidence || 0.5 };
      }
      if (parsed.tool) {
        return { type: 'tool_selection', data: parsed, confidence: 1 };
      }
      if (parsed.options) {
        return { type: 'clarification', data: parsed, confidence: 0.8 };
      }
      if (parsed.output) {
        return { type: 'output', data: parsed, confidence: 1 };
      }

      return { type: 'execution', data: parsed, confidence: 0.7 };
    }

    const lowered = raw.toLowerCase();
    if (lowered.includes('generate') || lowered.includes('create')) {
      return { type: 'intent', data: { intent: 'generate_command' }, confidence: 0.4 };
    }
    if (lowered.includes('convert')) {
      return { type: 'intent', data: { intent: 'convert' }, confidence: 0.4 };
    }
    if (lowered.includes('translate')) {
      return { type: 'intent', data: { intent: 'translate' }, confidence: 0.4 };
    }

    return { type: 'output', data: { response: raw }, confidence: 0.3 };
  } catch {
    return { type: 'output', data: { error: 'Failed to parse response' }, confidence: 0 };
  }
}

export function extractTool(response: ParsedResponse): string | null {
  if (response.type === 'tool_selection') {
    return (response.data.tool as string) || null;
  }
  if (response.type === 'intent') {
    return (response.data.intent as string) || null;
  }
  return null;
}

export function extractOptions(response: ParsedResponse): Array<{
  id: string;
  label: string;
  description: string;
}> | null {
  if (response.type === 'clarification' && Array.isArray(response.data.options)) {
    return response.data.options as any[];
  }
  return null;
}
