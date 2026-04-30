export function canAddMoreImages(
  currentCount: number,
  userCredits: number,
  isPro: boolean
): {
  allowed: boolean;
  maxReached: boolean;
  insufficientCredits: boolean;
  message: string;
} {
  const max = isPro ? 5 : userCredits >= 10 ? 5 : 0;

  if (max === 0) {
    return {
      allowed: false,
      maxReached: false,
      insufficientCredits: true,
      message: 'Image upload requires at least 10 credits for free users, or upgrade to Pro.',
    };
  }

  if (currentCount >= max) {
    return {
      allowed: false,
      maxReached: true,
      insufficientCredits: false,
      message: `Maximum ${max} images per document reached.`,
    };
  }

  return {
    allowed: true,
    maxReached: false,
    insufficientCredits: false,
    message: `${currentCount}/${max} images`,
  };
}

export function getImageLimitForUser(userCredits: number, isPro: boolean): number {
  if (isPro) return 5;
  if (userCredits >= 10) return 5;
  return 0;
}
