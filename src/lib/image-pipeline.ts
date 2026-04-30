import { validateImage, checkImageQuality } from './image-validation';
import { compressImageIfNeeded, blobToBase64 } from './image-compression';
import { addImage, storeImages, clearImages, ImageRecord } from './image-storage';

interface PipelineResult {
  success: boolean;
  image?: ImageRecord;
  error?: string;
}

export async function processImage(
  file: File,
  userId: string,
  placement: string = '',
  altText: string = ''
): Promise<PipelineResult> {
  const validation = validateImage(file);
  if (!validation.valid) {
    return { success: false, error: validation.error || 'Invalid image' };
  }

  const quality = await checkImageQuality(file);
  if (!quality.valid) {
    return { success: false, error: quality.error };
  }

  let processedBlob: Blob;
  let wasCompressed = false;

  if (validation.needsCompression) {
    const result = await compressImageIfNeeded(file);
    processedBlob = result.blob;
    wasCompressed = true;
  } else {
    processedBlob = new Blob([file], { type: file.type });
  }

  let base64: string;
  try {
    base64 = await blobToBase64(processedBlob);
  } catch {
    return { success: false, error: 'Failed to encode image' };
  }

  const image: ImageRecord = {
    id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fileName: file.name,
    base64,
    placement,
    altText: altText || file.name.replace(/\.[^.]+$/, ''),
    creditCost: 1,
    size: processedBlob.size,
    width: quality.width,
    height: quality.height,
    uploadedAt: Date.now(),
  };

  addImage(userId, image);

  return { success: true, image };
}

export function getPipelineStatus(userId: string): {
  count: number;
  images: ImageRecord[];
  totalCredits: number;
} {
  const images = getImagesFromStorage(userId);
  return {
    count: images.length,
    images,
    totalCredits: images.reduce((sum, img) => sum + img.creditCost, 0),
  };
}

function getImagesFromStorage(userId: string): ImageRecord[] {
  const { getImages } = require('./image-storage');
  return getImages(userId);
}

export function cleanupPipeline(userId: string): void {
  clearImages(userId);
}
