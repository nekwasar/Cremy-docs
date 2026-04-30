export function validateConvertFile(file: File): { valid: boolean; error?: string } {
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 10MB` };
  }

  return { valid: true };
}
