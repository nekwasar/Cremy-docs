import { GenerationError, GenerationErrorCode } from '@/server/errors';

export function handleGenerationError(error: unknown): {
  status: number;
  message: string;
  retry: boolean;
  partialContent?: string;
} {
  if (error instanceof GenerationError) {
    switch (error.code) {
      case GenerationErrorCode.INVALID_INPUT:
        return { status: 400, message: error.message, retry: false };
      case GenerationErrorCode.INSUFFICIENT_CREDITS:
        return { status: 429, message: 'Insufficient credits. Please purchase more credits.', retry: false };
      case GenerationErrorCode.AI_API_ERROR:
        return { status: 500, message: 'AI service error. Please try again.', retry: true };
      case GenerationErrorCode.NETWORK_ERROR:
        return { status: 503, message: 'Network error. Retrying...', retry: true };
      case GenerationErrorCode.TIMEOUT:
        return { status: 504, message: 'Generation timed out. You can retry or continue.', retry: true };
      default:
        return { status: 500, message: error.message, retry: true };
    }
  }

  if (error instanceof Error) {
    return { status: 500, message: error.message, retry: true };
  }

  return { status: 500, message: 'An unknown error occurred', retry: true };
}

export function handleEditError(error: unknown): {
  status: number;
  message: string;
  retry: boolean;
  partialContent?: string;
} {
  if (error instanceof GenerationError) {
    return { status: 400, message: error.message, retry: true, partialContent: '' };
  }

  if (error instanceof Error) {
    return { status: 500, message: error.message, retry: true };
  }

  return { status: 500, message: 'Edit operation failed', retry: true };
}

export function getRetryDelay(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt), 10000);
}