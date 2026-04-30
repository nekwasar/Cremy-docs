interface ValidationResult {
  valid: boolean;
  errors: string[];
  missingFields: string[];
}

export function validateFormatOutput(
  content: string,
  schema: Record<string, any>
): ValidationResult {
  const errors: string[] = [];
  const missingFields: string[] = [];

  if (!content || content.trim().length === 0) {
    errors.push('Output content is empty');
    return { valid: false, errors, missingFields };
  }

  if (schema.required && Array.isArray(schema.required)) {
    for (const field of schema.required) {
      if (!contentContainsField(content, field as string)) {
        missingFields.push(field as string);
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    missingFields,
  };
}

function contentContainsField(content: string, field: string): boolean {
  const lowerContent = content.toLowerCase();
  const lowerField = field.toLowerCase();

  if (lowerContent.includes(lowerField)) {
    return true;
  }

  const fieldWords = lowerField.split(/(?=[A-Z])/).join(' ').toLowerCase();
  if (lowerContent.includes(fieldWords)) {
    return true;
  }

  if (lowerContent.includes(`# ${lowerField}`) || lowerContent.includes(`## ${lowerField}`)) {
    return true;
  }

  return false;
}

export function getValidationScore(result: ValidationResult, schema: Record<string, any>): number {
  if (!schema.required || !Array.isArray(schema.required) || schema.required.length === 0) {
    return 100;
  }

  const total = schema.required.length;
  const found = total - result.missingFields.length;
  return Math.round((found / total) * 100);
}