export function convertEbook(content: string, targetFormat: string): string {
  if (targetFormat === 'pdf') {
    return content;
  }
  if (targetFormat === 'html') {
    return `<html><body>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</body></html>`;
  }
  return content;
}
