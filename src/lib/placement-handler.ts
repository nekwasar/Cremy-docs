import { parsePlacement, getPlacementPrompt, ImagePlacement } from './image-placement';

interface PlacementContext {
  sections: Array<{ id: string; heading: string }>;
  paragraphs: string[];
}

export function determinePlacement(
  userDescription: string,
  context?: PlacementContext
): {
  placement: ImagePlacement;
  prompt: string;
} {
  const placement = parsePlacement(userDescription);
  const prompt = getPlacementPrompt(placement);

  return { placement, prompt };
}

export function getValidPlacements(): string[] {
  return [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'after paragraph 1',
    'after section 2',
    'between section 1 and 2',
    'inline',
  ];
}
