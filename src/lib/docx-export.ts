export async function exportToDOCX(content: string): Promise<Blob> {
  try {
    const htmlContent = content.replace(/\n/g, '<br/>');
    const docxContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><title>Document</title></head>
        <body>${htmlContent}</body>
      </html>`;
    
    return new Blob([docxContent], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  } catch {
    return new Blob([content], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  }
}
