export function generateAltText(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function generateAIImageAltText(base64Image: string): Promise<string> {
  return 'Image';
}

export function getDefaultAltText(index: number): string {
  return `Image ${index + 1}`;
}
