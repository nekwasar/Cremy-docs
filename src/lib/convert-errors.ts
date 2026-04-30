export class ConvertError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'ConvertError';
  }
}

export function handleConvertError(error: unknown): {
  message: string;
  code: string;
  retryable: boolean;
} {
  if (error instanceof ConvertError) {
    return { message: error.message, code: error.code, retryable: error.retryable };
  }

  if (error instanceof Error) {
    return { message: error.message, code: 'CONVERSION_FAILED', retryable: true };
  }

  return { message: 'Conversion failed', code: 'UNKNOWN', retryable: true };
}
