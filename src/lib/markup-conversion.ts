export function convertMarkup(content: string, targetFormat: string): string {
  if (targetFormat === 'html') {
    if (content.startsWith('<')) return content;
    return `<html><body>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</body></html>`;
  }
  if (targetFormat === 'md') {
    if (content.startsWith('<')) {
      return content.replace(/<h1>(.*?)<\/h1>/g, '# $1')
        .replace(/<h2>(.*?)<\/h2>/g, '## $1')
        .replace(/<p>(.*?)<\/p>/g, '$1\n')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<[^>]+>/g, '');
    }
    return content;
  }
  return content;
}
