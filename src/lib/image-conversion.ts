export async function convertImage(
  file: File,
  targetFormat: string
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(new Blob([], { type: 'application/pdf' }));
        return;
      }
      ctx.drawImage(img, 0, 0);
      
      const mimeType = targetFormat === 'jpg' || targetFormat === 'jpeg' 
        ? 'image/jpeg' 
        : targetFormat === 'png' ? 'image/png' 
        : targetFormat === 'webp' ? 'image/webp' 
        : 'image/png';
      
      canvas.toBlob((blob) => resolve(blob || new Blob()), mimeType);
    };
    
    img.onerror = () => resolve(new Blob());
    img.src = url;
  });
}
