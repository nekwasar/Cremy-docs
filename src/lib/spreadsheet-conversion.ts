export function convertSpreadsheetContent(content: string, targetFormat: string): string {
  if (targetFormat === 'csv') {
    return content
      .split('\n')
      .map((line) => {
        if (line.startsWith('|')) {
          return line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim()).join(',');
        }
        return line;
      })
      .join('\n');
  }
  return content;
}
