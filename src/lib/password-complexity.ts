export function validatePasswordComplexity(password: string): {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'strong';
} {
  const errors: string[] = [];

  if (password.length < 12) errors.push('Password must be at least 12 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must include at least 1 uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Must include at least 1 lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Must include at least 1 number');
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) errors.push('Must include at least 1 special character');

  let strength: 'weak' | 'fair' | 'strong' = 'weak';
  const score = [
    password.length >= 12,
    password.length >= 16,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    /[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  ].filter(Boolean).length;

  if (score >= 7) strength = 'strong';
  else if (score >= 5) strength = 'fair';

  return { valid: errors.length === 0, errors, strength };
}
