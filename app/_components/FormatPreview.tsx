'use client';

interface FormatPreviewProps {
  previewUrl?: string;
  formatName: string;
}

export function FormatPreview({ previewUrl, formatName }: FormatPreviewProps) {
  if (previewUrl) {
    return (
      <div>
        <video src={previewUrl} controls width="100%" poster="">
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  return (
    <div>
      <div>
        <p>{formatName} Preview</p>
        <p>Preview will appear here</p>
      </div>
    </div>
  );
}