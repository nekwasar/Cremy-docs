'use client';

interface DownloadButtonProps {
  documentId: string;
  disabled?: boolean;
}

export function DownloadButton({ documentId, disabled = false }: DownloadButtonProps) {
  const handleDownload = async (format: string) => {
    const response = await fetch(`/api/documents/${documentId}/download?format=${format}`);
    if (!response.ok) return;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <select
      onChange={(e) => {
        if (e.target.value) {
          handleDownload(e.target.value);
          e.target.value = '';
        }
      }}
      disabled={disabled}
      defaultValue=""
    >
      <option value="" disabled>
        Download
      </option>
      <option value="pdf">PDF</option>
      <option value="docx">DOCX</option>
      <option value="txt">TXT</option>
    </select>
  );
}