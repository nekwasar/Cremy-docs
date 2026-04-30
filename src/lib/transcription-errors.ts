export class TranscriptionError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_AUDIO' | 'API_FAILURE' | 'TIMEOUT' | 'NO_SPEECH' | 'FORMAT_ERROR',
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'TranscriptionError';
  }
}

export function handleTranscriptionError(error: unknown): {
  message: string;
  code: string;
  retryable: boolean;
} {
  if (error instanceof TranscriptionError) {
    return { message: error.message, code: error.code, retryable: error.retryable };
  }

  if (error instanceof Error) {
    if (error.message.includes('timed out')) {
      return {
        message: 'Transcription timed out. Please try again with a shorter recording.',
        code: 'TIMEOUT',
        retryable: true,
      };
    }
    if (error.message.includes('No speech detected')) {
      return {
        message: 'No speech detected. Please record your message and try again.',
        code: 'NO_SPEECH',
        retryable: true,
      };
    }
    return {
      message: error.message,
      code: 'API_FAILURE',
      retryable: true,
    };
  }

  return {
    message: 'An unknown error occurred during transcription',
    code: 'API_FAILURE',
    retryable: true,
  };
}

export function getTranscriptionRetryDelay(attempt: number): number {
  return Math.min(2000 * Math.pow(2, attempt), 10000);
}
