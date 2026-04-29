interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateInput(text: string): ValidationResult {
  const errors: string[] = [];

  if (!text || text.trim().length === 0) {
    errors.push('Input cannot be empty');
  }

  if (text.length > 10000) {
    errors.push('Input exceeds 10,000 character limit');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}