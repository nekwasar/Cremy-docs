export function parseInputContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function extractImagesFromContent(content: string): string[] {
  const matches = content.match(/!\[([^\]]*)\]\(([^)]+)\)/g);
  return matches || [];
}

export function extractTablesFromContent(content: string): string[] {
  const lines = content.split('\n');
  const tables: string[] = [];
  let currentTable: string[] = [];

  for (const line of lines) {
    if (line.startsWith('|') && line.includes('|')) {
      currentTable.push(line);
    } else if (currentTable.length > 0) {
      tables.push(currentTable.join('\n'));
      currentTable = [];
    }
  }
  if (currentTable.length > 0) tables.push(currentTable.join('\n'));

  return tables;
}
