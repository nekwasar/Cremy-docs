'use client';

interface ImageUploadProgressProps {
  progress: number;
  isUploading: boolean;
  error?: string;
}

export function ImageUploadProgress({ progress, isUploading, error }: ImageUploadProgressProps) {
  if (!isUploading && !error) return null;

  return (
    <div>
      {isUploading && (
        <div>
          <progress value={progress} max={100}>{progress}%</progress>
          <span>{progress}%</span>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}