export async function exportToXLSX(content: string): Promise<Blob> {
  const lines = content.split('\n');
  const csvContent = lines.map((line) => {
    if (line.startsWith('|')) {
      return line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => `"${cell.trim().replace(/"/g, '""')}"`)
        .join(',');
    }
    return line;
  }).join('\n');

  return new Blob([csvContent], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
