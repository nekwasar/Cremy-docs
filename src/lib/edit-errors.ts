export function handleEditValidation(instruction: string): {
  valid: boolean;
  error?: string;
} {
  if (!instruction || instruction.trim().length === 0) {
    return { valid: false, error: 'Edit instruction cannot be empty' };
  }

  if (instruction.trim().length < 3) {
    return { valid: false, error: 'Edit instruction is too short. Please be more specific.' };
  }

  if (instruction.length > 1000) {
    return { valid: false, error: 'Edit instruction too long. Maximum 1000 characters.' };
  }

  return { valid: true };
}

export function formatEditError(code: string, message: string): string {
  switch (code) {
    case 'INVALID_INSTRUCTION':
      return `Cannot process: ${message}. Try rephrasing your edit command.`;
    case 'ELEMENT_NOT_FOUND':
      return 'The target element was not found. It may have been removed.';
    case 'AI_EDIT_FAILED':
      return `AI edit failed: ${message}. You can retry with a different instruction.`;
    case 'PARTIAL_EDIT':
      return `Edit was partially applied. ${message}`;
    default:
      return `Edit error: ${message}`;
  }
}