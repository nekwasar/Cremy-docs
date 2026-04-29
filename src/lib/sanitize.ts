export function sanitizeContent(content: string): string {
  let sanitized = content;
  
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  
  return sanitized.trim();
}