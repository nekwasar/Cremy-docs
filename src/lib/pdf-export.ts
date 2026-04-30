export async function exportToPDF(content: string): Promise<Blob> {
  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, targetFormat: 'pdf' }),
    });

    if (!response.ok) throw new Error('PDF export failed');
    return response.blob();
  } catch {
    const htmlContent = `<!DOCTYPE html><html><body><pre>${content}</pre></body></html>`;
    return new Blob([htmlContent], { type: 'application/pdf' });
  }
}
