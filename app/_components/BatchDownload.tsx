'use client';

interface BatchDownloadProps {
  files: Array<{ name: string; blob: Blob }>;
}

export function BatchDownload({ files }: BatchDownloadProps) {
  const handleDownloadAll = () => {
    files.forEach((file) => {
      const url = URL.createObjectURL(file.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div>
      <button onClick={handleDownloadAll} type="button">
        Download All ({files.length} files)
      </button>
      <ul>
        {files.map((file, index) => {
          const url = URL.createObjectURL(file.blob);
          return (
            <li key={index}>
              <a href={url} download={file.name}>{file.name}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}