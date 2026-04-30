export interface ParsedSection {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'table' | 'image';
  content: any;
  order: number;
}

export function parseDocument(content: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const lines = content.split('\n');
  let order = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('![') || (line.startsWith('<img') && line.includes('src='))) {
      const imgMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        sections.push({
          id: '',
          type: 'image',
          content: { alt: imgMatch[1], src: imgMatch[2] },
          order: order++,
        });
      }
      i++;
      continue;
    }

    if (line.startsWith('|') && line.includes('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const tableData = parseTable(tableLines);
      if (tableData) {
        sections.push({ id: '', type: 'table', content: tableData, order: order++ });
      }
      continue;
    }

    if (line.startsWith('# ')) {
      sections.push({ id: '', type: 'heading', content: { text: line.slice(2), level: 1 }, order: order++ });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      sections.push({ id: '', type: 'heading', content: { text: line.slice(3), level: 2 }, order: order++ });
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      sections.push({ id: '', type: 'heading', content: { text: line.slice(4), level: 3 }, order: order++ });
      i++;
      continue;
    }

    if (/^[\s]*[-*+]\s/.test(line) || /^[\s]*\d+[.)]\s/.test(line)) {
      const items: string[] = [];
      const isOrdered = /^[\s]*\d+[.)]\s/.test(line);
      while (i < lines.length && (/^[\s]*[-*+]\s/.test(lines[i]) || /^[\s]*\d+[.)]\s/.test(lines[i]))) {
        const cleaned = lines[i].replace(/^[\s]*[-*+]\s/, '').replace(/^[\s]*\d+[.)]\s/, '');
        items.push(cleaned);
        i++;
      }
      sections.push({ id: '', type: 'list', content: { items, ordered: isOrdered }, order: order++ });
      continue;
    }

    if (line.trim() !== '') {
      const paragraphLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('|') && !lines[i].startsWith('![')) {
        paragraphLines.push(lines[i]);
        i++;
      }
      sections.push({
        id: '',
        type: 'paragraph',
        content: { text: paragraphLines.join('\n') },
        order: order++,
      });
      continue;
    }

    i++;
  }

  return sections;
}

function parseTable(lines: string[]): { headers: string[]; rows: string[][] } | null {
  if (lines.length < 2) return null;

  const parseRow = (line: string): string[] =>
    line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim());

  const headers = parseRow(lines[0]);

  if (lines[1] && lines[1].match(/^[\s|:-]+$/)) {
    lines.splice(1, 1);
  }

  const rows = lines.slice(1).map(parseRow);

  return { headers, rows };
}