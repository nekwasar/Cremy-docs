'use client';

interface MultiConvertProps {
  files: File[];
  onConvertAll: (targetFormat: string) => void;
  onRemoveFile: (index: number) => void;
}

export function MultiConvert({ files, onConvertAll, onRemoveFile }: MultiConvertProps) {
  return (
    <div>
      <p>{files.length} file{files.length !== 1 ? 's' : ''} selected</p>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <span>{file.name}</span>
            <span>{(file.size / 1024).toFixed(1)} KB</span>
            <button onClick={() => onRemoveFile(index)} type="button">Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => onConvertAll('pdf')} type="button">
        Convert All to PDF
      </button>
    </div>
  );
}