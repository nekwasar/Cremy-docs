export function convertLegacy(content: string, sourceFormat: string, targetFormat: string): string {
  if (sourceFormat === 'rtf' || sourceFormat === 'odt') {
    return content.replace(/\\[a-z]+/g, '');
  }
  return content;
}
