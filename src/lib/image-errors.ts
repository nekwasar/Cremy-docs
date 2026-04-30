export function getImageError(code: string): string {
  switch (code) {
    case 'INVALID_FORMAT':
      return 'Unsupported image format. Accepted: PNG, JPG, WEBP, GIF';
    case 'TOO_LARGE':
      return 'Image too large. Maximum: 10MB';
    case 'TOO_SMALL':
      return 'Image too small. Minimum dimensions: 100x100 pixels';
    case 'UPLOAD_FAILED':
      return 'Image upload failed. Please try again.';
    case 'COMPRESSION_FAILED':
      return 'Image compression failed. Try a smaller image.';
    case 'MAX_IMAGES':
      return 'Maximum 5 images per document reached.';
    case 'NOT_ENOUGH_CREDITS':
      return 'Not enough credits. Image upload requires available credits.';
    case 'INSUFFICIENT_FREE':
      return 'Image upload requires at least 10 credits for free users, or upgrade to Pro.';
    default:
      return 'An error occurred with the image.';
  }
}

export function handleImageError(error: unknown): {
  message: string;
  retryable: boolean;
} {
  if (error instanceof Error) {
    if (error.message.includes('format') || error.message.includes('type')) {
      return { message: getImageError('INVALID_FORMAT'), retryable: false };
    }
    if (error.message.includes('large') || error.message.includes('size')) {
      return { message: getImageError('TOO_LARGE'), retryable: false };
    }
    if (error.message.includes('small') || error.message.includes('dimension')) {
      return { message: getImageError('TOO_SMALL'), retryable: false };
    }
    return { message: error.message, retryable: true };
  }
  return { message: getImageError('UPLOAD_FAILED'), retryable: true };
}
