export async function exportToPPTX(content: string): Promise<Blob> {
  const slides = content.split(/^# /gm).filter(Boolean).map((slide, index) => ({
    title: slide.split('\n')[0] || `Slide ${index + 1}`,
    body: slide.split('\n').slice(1).join('\n'),
  }));

  const pptxContent = slides
    .map((slide) => `Slide: ${slide.title}\n${slide.body}`)
    .join('\n---\n');

  return new Blob([pptxContent], {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  });
}
