import { parsePlacement, getPlacementPrompt, ImagePlacement } from './image-placement';

interface ImageData {
  id: string;
  base64: string;
  placement: ImagePlacement;
  altText: string;
}

export function buildImagePrompt(
  text: string,
  images: ImageData[]
): string {
  if (images.length === 0) return text;

  let prompt = text + '\n\n';

  prompt += 'The following images should be placed in the document:\n\n';

  images.forEach((img, index) => {
    prompt += `Image ${index + 1}: [IMAGE:${img.id}]\n`;
    prompt += `Placement: ${getPlacementPrompt(img.placement)}\n`;
    if (img.altText) {
      prompt += `Alt text: ${img.altText}\n`;
    }
    prompt += '\n';
  });

  prompt += 'Generate the document with these images placed at the specified positions. Use [IMAGE:id] markers where images should appear.';

  return prompt;
}

export function getImageMarkers(content: string): string[] {
  const matches = content.match(/\[IMAGE:([^\]]+)\]/g);
  if (!matches) return [];
  return matches.map((m) => m.replace(/\[IMAGE:/, '').replace(/\]/, ''));
}
