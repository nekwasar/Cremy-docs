export interface ImagePlacement {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'after-paragraph' | 'between-sections' | 'inline';
  paragraphIndex?: number;
  sectionIndex?: number;
  description: string;
}

export function parsePlacement(text: string): ImagePlacement {
  const lower = text.toLowerCase();

  if (lower.includes('top left') || lower.includes('top-left')) {
    return { position: 'top-left', description: text };
  }
  if (lower.includes('top right') || lower.includes('top-right')) {
    return { position: 'top-right', description: text };
  }
  if (lower.includes('bottom left') || lower.includes('bottom-left')) {
    return { position: 'bottom-left', description: text };
  }
  if (lower.includes('bottom right') || lower.includes('bottom-right')) {
    return { position: 'bottom-right', description: text };
  }

  const afterPara = lower.match(/after\s*(?:paragraph|para|section)\s*(\d+)/);
  if (afterPara) {
    return {
      position: 'after-paragraph',
      paragraphIndex: parseInt(afterPara[1]) - 1,
      description: text,
    };
  }

  const betweenSec = lower.match(/between\s*(?:section|para|paragraph)\s*(\d+)\s*(?:and|&)\s*(\d+)/);
  if (betweenSec) {
    return {
      position: 'between-sections',
      sectionIndex: parseInt(betweenSec[1]) - 1,
      description: text,
    };
  }

  if (lower.includes('inline') || lower.includes('between text')) {
    return { position: 'inline', description: text };
  }

  return { position: 'inline', description: text };
}

export function getPlacementPrompt(placement: ImagePlacement): string {
  switch (placement.position) {
    case 'top-left':
      return 'Place this image at the top left of the document.';
    case 'top-right':
      return 'Place this image at the top right of the document.';
    case 'bottom-left':
      return 'Place this image at the bottom left of the document.';
    case 'bottom-right':
      return 'Place this image at the bottom right of the document.';
    case 'after-paragraph':
      return `Place this image after paragraph ${(placement.paragraphIndex || 0) + 1}.`;
    case 'between-sections':
      return `Place this image between section ${(placement.sectionIndex || 0) + 1} and ${(placement.sectionIndex || 0) + 2}.`;
    case 'inline':
      return 'Place this image inline with the text content.';
    default:
      return 'Place this image in the document at a logical position.';
  }
}
