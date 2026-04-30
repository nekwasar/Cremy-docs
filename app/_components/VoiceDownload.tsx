'use client';

interface VoiceDownloadProps {
  documentId?: string;
  formattedText?: string;
}

export function VoiceDownload({ documentId, formattedText }: VoiceDownloadProps) {
  const handleDownload = (format: string) => {
    const content = formattedText || '';

    if (format === 'txt') {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'voice-document.txt';
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (documentId) {
      fetch(`/api/documents/${documentId}/download?format=${format}`)
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `voice-document.${format}`;
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch(console.error);
    }
  };

  return (
    <select
      onChange={(e) => {
        if (e.target.value) {
          handleDownload(e.target.value);
          e.target.value = '';
        }
      }}
      defaultValue=""
    >
      <option value="" disabled>Download</option>
      <option value="pdf">PDF</option>
      <option value="docx">DOCX</option>
      <option value="txt">TXT</option>
    </select>
  );
}