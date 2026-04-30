export function formatOutputForTarget(content: string, targetFormat: string): string {
  switch (targetFormat) {
    case 'html':
      return `<html><body>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</body></html>`;
    case 'md':
      return content;
    case 'txt':
      return content.replace(/^#+\s/gm, '').replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '');
    case 'csv':
      return content.split('\n').filter(Boolean).map((line) => line.replace(/\|/g, ',').replace(/^,/, '').replace(/,$/, '')).join('\n');
    default:
      return content;
  }
}
