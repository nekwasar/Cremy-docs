type InputFormat = 'markdown' | 'plaintext' | 'html' | 'docx';

export function extractContent(input: string, format: InputFormat): string {
  switch (format) {
    case 'markdown':
      return extractMarkdown(input);
    case 'html':
      return extractHtml(input);
    case 'docx':
      return extractDocx(input);
    case 'plaintext':
    default:
      return input.trim();
  }
}

function extractMarkdown(input: string): string {
  let content = input.replace(/^#+\s/gm, '');
  
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  content = content.replace(/[\*_~`>/\\]/g, '');
  
  content = content.replace(/\n{3,}/g, '\n\n');
  
  return content.trim();
}

function extractHtml(input: string): string {
  let content = input.replace(/<[^>]*>/g, '');
  
  content = content.replace(/&amp;/g, '&');
  content = content.replace(/&lt;/g, '<');
  content = content.replace(/&gt;/g, '>');
  content = content.replace(/&quot;/g, '"');
  content = content.replace(/&#39;/g, "'");
  
  content = content.replace(/\s+/g, ' ');
  
  return content.trim();
}

function extractDocx(input: string): string {
  let content = input.replace(/<\/?[^>]+(>|$)/g, '');
  
  content = content.replace(/<\?xml[^>]+>/g, '');
  
  content = content.replace(/\s+/g, ' ');
  
  return content.trim();
}

export function detectInputFormat(input: string): InputFormat {
  if (input.startsWith('#') || input.includes('**')) {
    return 'markdown';
  }
  if (input.startsWith('<') && input.includes('<')) {
    return 'html';
  }
  return 'plaintext';
}