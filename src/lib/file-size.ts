export function checkFileSize(file: File): {
  valid: boolean;
  size: number;
  formattedSize: string;
  error?: string;
} {
  const size = file.size;
  let formattedSize: string;

  if (size >= 1024 * 1024) {
    formattedSize = `${(size / (1024 * 1024)).toFixed(1)} MB`;
  } else if (size >= 1024) {
    formattedSize = `${(size / 1024).toFixed(1)} KB`;
  } else {
    formattedSize = `${size} B`;
  }

  if (size > 10 * 1024 * 1024) {
    return { valid: false, size, formattedSize, error: `File exceeds 10MB limit` };
  }

  return { valid: true, size, formattedSize };
}
