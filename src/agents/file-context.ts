interface FileInfo {
  id: string;
  name: string;
  type: string;
}

interface FileContextResult {
  selectedFile: FileInfo | null;
  needsClarification: boolean;
  message: string;
  options?: Array<{ id: string; label: string; description: string }>;
}

export function getFileContext(files: FileInfo[], message: string): FileContextResult {
  if (files.length === 0) {
    return { selectedFile: null, needsClarification: false, message: '' };
  }

  if (files.length === 1) {
    return {
      selectedFile: files[0],
      needsClarification: false,
      message: `Using file: ${files[0].name}`,
    };
  }

  const mentionedFile = files.find((f) =>
    message.toLowerCase().includes(f.name.toLowerCase())
  );

  if (mentionedFile) {
    return {
      selectedFile: mentionedFile,
      needsClarification: false,
      message: `Using file: ${mentionedFile.name}`,
    };
  }

  return {
    selectedFile: null,
    needsClarification: true,
    message: 'You have multiple files. Which file are you referring to?',
    options: files.map((f) => ({
      id: f.id,
      label: f.name,
      description: f.type || 'File',
    })),
  };
}
