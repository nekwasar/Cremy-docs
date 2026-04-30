import fs from 'fs';
import path from 'path';

export function validateConversionPairs(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const configPath = path.join(process.cwd(), 'src', 'config', 'convert-pairs.ts');
    if (!fs.existsSync(configPath)) {
      errors.push('Conversion pairs config not found');
      return { valid: false, errors, warnings };
    }
  } catch {}

  return { valid: true, errors, warnings };
}
