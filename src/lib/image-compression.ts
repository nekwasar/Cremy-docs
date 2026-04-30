export async function compressImage(file: File, quality: number = 0.7): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      let { width, height } = img;
      if (width > 2048) {
        height = (height / width) * 2048;
        width = 2048;
      }
      if (height > 2048) {
        width = (width / height) * 2048;
        height = 2048;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Compression failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = url;
  });
}

export async function compressImageIfNeeded(file: File): Promise<{ blob: Blob; wasCompressed: boolean; originalSize: number; compressedSize: number }> {
  if (file.size <= 5 * 1024 * 1024) {
    const blob = new Blob([file], { type: file.type });
    return { blob, wasCompressed: false, originalSize: file.size, compressedSize: file.size };
  }

  const compressed = await compressImage(file);
  return {
    blob: compressed,
    wasCompressed: true,
    originalSize: file.size,
    compressedSize: compressed.size,
  };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to convert image to base64'));
    reader.readAsDataURL(blob);
  });
}
