export enum GenerationErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  INSUFFICIENT_CREDITS = 'INSUFFICIENT_CREDITS',
  AI_API_ERROR = 'AI_API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class GenerationError extends Error {
  constructor(
    public code: GenerationErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'GenerationError';
  }
}

export function handleError(error: unknown): { code: string; message: string } {
  if (error instanceof GenerationError) {
    return { code: error.code, message: error.message };
  }

  if (error instanceof Error) {
    return { code: GenerationErrorCode.INTERNAL_ERROR, message: error.message };
  }

  return { code: GenerationErrorCode.INTERNAL_ERROR, message: 'Unknown error' };
}