'use client';

interface ConvertDownloadProps {
  blob: Blob | null;
  fileName: string;
  disabled?: boolean;
}

export function ConvertDownload({ blob, fileName, disabled = false }: ConvertDownloadProps) {
  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} disabled={disabled || !blob} type="button">
      Download Converted File
    </button>
  );
}