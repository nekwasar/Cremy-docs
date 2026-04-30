export async function convertWithAI(
  file: File,
  targetFormat: string
): Promise<Blob> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetFormat', targetFormat);

  const response = await fetch('/api/convert', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`AI conversion failed: ${response.status}`);
  }

  return response.blob();
}

export async function convertToPDF(content: string): Promise<Blob> {
  const parts = [
    '<html><head><meta charset="utf-8"><title>Document</title>',
    '<style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.6}',
    'h1{font-size:24px}h2{font-size:20px}h3{font-size:16px}',
    'table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}',
    '</style></head><body>',
    content,
    '</body></html>',
  ];

  return new Blob([parts.join('\n')], { type: 'application/pdf' });
}
