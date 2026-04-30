export function convertPresentationContent(content: string, targetFormat: string): string {
  const slides = content.split(/^#\s/gm).filter(Boolean);
  
  if (slides.length === 0) return content;

  return slides.map((slide, i) => {
    const lines = slide.split('\n');
    const title = lines[0] || `Slide ${i + 1}`;
    const body = lines.slice(1).filter(Boolean).join('\n');
    return `Slide ${i + 1}: ${title}\n${body}`;
  }).join('\n\n---\n\n');
}
