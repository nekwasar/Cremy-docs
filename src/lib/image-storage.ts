export interface ImageRecord {
  id: string;
  fileName: string;
  base64: string;
  placement: string;
  altText: string;
  creditCost: number;
  size: number;
  width?: number;
  height?: number;
  uploadedAt: number;
}

const imageStorage = new Map<string, ImageRecord[]>();

export function storeImages(userId: string, images: ImageRecord[]): void {
  imageStorage.set(userId, images);
}

export function getImages(userId: string): ImageRecord[] {
  return imageStorage.get(userId) || [];
}

export function addImage(userId: string, image: ImageRecord): void {
  const current = getImages(userId);
  current.push(image);
  storeImages(userId, current);
}

export function removeImage(userId: string, imageId: string): ImageRecord | null {
  const current = getImages(userId);
  const index = current.findIndex((img) => img.id === imageId);
  if (index === -1) return null;

  const [removed] = current.splice(index, 1);
  storeImages(userId, current);
  return removed;
}

export function clearImages(userId: string): void {
  imageStorage.delete(userId);
}

export function cleanupExpiredImages(maxAgeMs: number = 30 * 60 * 1000): void {
  const now = Date.now();
  imageStorage.forEach((images, userId) => {
    const filtered = images.filter((img) => now - img.uploadedAt < maxAgeMs);
    if (filtered.length === 0) {
      imageStorage.delete(userId);
    } else {
      imageStorage.set(userId, filtered);
    }
  });
}
