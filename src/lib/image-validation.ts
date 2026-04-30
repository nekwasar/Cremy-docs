const ALLOWED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024;
const COMPRESSION_THRESHOLD = 5 * 1024 * 1024;
const MIN_DIMENSIONS = { width: 100, height: 100 };

interface ValidationResult {
  valid: boolean;
  error?: string;
  needsCompression: boolean;
  format?: string;
}

export function validateImage(file: File): ValidationResult {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

  if (extension && !allowedExtensions.includes(extension)) {
    return { valid: false, error: `Unsupported format: .${extension}. Accepted: PNG, JPG, WEBP, GIF`, needsCompression: false };
  }

  const isAllowedMime = ALLOWED_FORMATS.some(
    (fmt) => file.type === fmt || file.type === fmt.replace('image/', 'image/').replace('jpg', 'jpeg')
  );

  if (!isAllowedMime && file.type && !file.type.startsWith('image/')) {
    return { valid: false, error: `Unsupported format: ${file.type}`, needsCompression: false };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: `Image too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 10MB`, needsCompression: false };
  }

  if (file.size === 0) {
    return { valid: false, error: 'Image file is empty', needsCompression: false };
  }

  return {
    valid: true,
    needsCompression: file.size > COMPRESSION_THRESHOLD,
    format: file.type || extension,
  };
}

export async function checkImageQuality(file: File): Promise<{
  valid: boolean;
  width?: number;
  height?: number;
  error?: string;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (img.width < MIN_DIMENSIONS.width || img.height < MIN_DIMENSIONS.height) {
        resolve({
          valid: false,
          width: img.width,
          height: img.height,
          error: `Image too small: ${img.width}x${img.height}. Minimum: 100x100`,
        });
      } else {
        resolve({ valid: true, width: img.width, height: img.height });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: 'Failed to load image for quality check' });
    };

    img.src = url;
  });
}

export function shouldCompress(file: File): boolean {
  return file.size > COMPRESSION_THRESHOLD;
}
