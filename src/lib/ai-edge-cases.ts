interface AIErrorResult {
  type: 'timeout' | 'partial' | 'invalid_input' | 'empty_input' | 'api_error';
  message: string;
  retryable: boolean;
  partialContent?: string;
  suggestions?: string[];
}

export function handleAITimeout(
  partialContent?: string,
  percentComplete?: number
): AIErrorResult {
  const canSave = percentComplete && percentComplete > 50;

  return {
    type: 'timeout',
    message: canSave
      ? `Generation timed out after ${percentComplete}% complete. Your partial document has been saved. You can continue from where it stopped or retry.`
      : 'Generation timed out. Please try again with a shorter description.',
    retryable: true,
    partialContent: canSave ? partialContent : undefined,
    suggestions: ['Try a shorter description', 'Break your request into smaller parts', 'Check your internet connection'],
  };
}

export function handlePartialResponse(
  content: string,
  percentComplete: number
): AIErrorResult {
  return {
    type: 'partial',
    message: `Your document was partially generated (${percentComplete}% complete). The content so far has been saved. You can continue from this point or start over.`,
    retryable: true,
    partialContent: content,
    suggestions: ['Continue from where generation stopped', 'Start a new generation with refined input', 'Download the partial content'],
  };
}

export function handleInvalidInput(reason: string): AIErrorResult {
  const suggestions: Record<string, string[]> = {
    'too_short': ['Try writing at least 10 characters', 'Describe what kind of document you want', 'Be more specific about the content'],
    'too_long': ['Your input exceeds 50,000 characters', 'Break your content into smaller parts', 'Try generating sections one at a time'],
    'special_chars': ['Remove special characters from your input', 'Use plain text descriptions'],
  };

  return {
    type: 'invalid_input',
    message: `Invalid input: ${reason}. Please check your input and try again.`,
    retryable: true,
    suggestions: suggestions[reason] || ['Make sure your input is valid', 'Use clear, descriptive text'],
  };
}

export function handleEmptyInput(): AIErrorResult {
  return {
    type: 'empty_input',
    message: 'Please enter some text to generate your document. Describe what you want to create.',
    retryable: false,
    suggestions: ['Type a description of your document', 'Paste text you want to format', 'Try one of our templates'],
  };
}

export function handleAIAPIError(statusCode: number): AIErrorResult {
  switch (statusCode) {
    case 429:
      return {
        type: 'api_error',
        message: 'Too many requests. Please wait a moment and try again.',
        retryable: true,
        suggestions: ['Wait a few seconds before retrying', 'Reduce the frequency of your requests'],
      };
    case 503:
      return {
        type: 'api_error',
        message: 'AI service is temporarily unavailable. Our team has been notified.',
        retryable: true,
        suggestions: ['Try again in a few minutes', 'Use a simpler format for now'],
      };
    default:
      return {
        type: 'api_error',
        message: 'AI generation failed. Please try again.',
        retryable: true,
        suggestions: ['Try again', 'Check your input', 'Try a different document format'],
      };
  }
}
