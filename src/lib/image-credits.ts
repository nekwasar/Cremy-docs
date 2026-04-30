const COST_PER_IMAGE = 1;
const MAX_IMAGES = 5;
const MAX_IMAGES_FREE_LOW = 0;

interface CreditResult {
  allowed: boolean;
  creditsRequired: number;
  message?: string;
}

export function getMaxImages(userCredits: number, isPro: boolean): number {
  if (isPro) return MAX_IMAGES;
  if (userCredits >= 10) return MAX_IMAGES;
  return MAX_IMAGES_FREE_LOW;
}

export function canAddImage(
  currentCount: number,
  userCredits: number,
  isPro: boolean
): CreditResult {
  const max = getMaxImages(userCredits, isPro);

  if (max === 0) {
    return {
      allowed: false,
      creditsRequired: COST_PER_IMAGE,
      message: 'Image upload requires at least 10 credits. Purchase credits to enable images.',
    };
  }

  if (currentCount >= max) {
    return {
      allowed: false,
      creditsRequired: COST_PER_IMAGE,
      message: `Maximum ${max} images per document reached.`,
    };
  }

  return { allowed: true, creditsRequired: COST_PER_IMAGE };
}

export function calculateImageCredits(count: number): number {
  return count * COST_PER_IMAGE;
}

export function refundImageCredit(): number {
  return COST_PER_IMAGE;
}

export function getReplaceCreditCost(): number {
  return COST_PER_IMAGE;
}

export function getUserImageLimit(userCredits: number, isPro: boolean): {
  max: number;
  used: number;
  available: number;
  message: string;
} {
  const max = getMaxImages(userCredits, isPro);
  return {
    max,
    used: 0,
    available: max,
    message: max === 0
      ? 'No images available. Need 10+ credits or Pro.'
      : `${max} images available`,
  };
}
