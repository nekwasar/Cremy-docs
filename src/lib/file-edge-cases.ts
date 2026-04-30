interface FileErrorResult {
  type: 'too_large' | 'unsupported_format' | 'conversion_failed' | 'corrupted';
  message: string;
  retryable: boolean;
  suggestions: string[];
}

export function handleFileTooLarge(fileSize: number, maxSize: number = 10 * 1024 * 1024): FileErrorResult {
  const sizeMB = (fileSize / (1024 * 1024)).toFixed(1);
  const maxMB = (maxSize / (1024 * 1024)).toFixed(0);

  return {
    type: 'too_large',
    message: `File is too large (${sizeMB}MB). Maximum file size is ${maxMB}MB.`,
    retryable: true,
    suggestions: [
      'Compress your file before uploading',
      'Use our compress PDF tool to reduce file size',
      'Split large documents into smaller parts',
      'Try a different file format that produces smaller files',
    ],
  };
}

export function handleUnsupportedFormat(
  fileName: string,
  supportedFormats: string[] = ['PDF', 'DOCX', 'DOC', 'ODT', 'RTF', 'TXT', 'PPTX', 'XLSX', 'CSV', 'JPG', 'PNG', 'WEBP', 'HTML', 'MD']
): FileErrorResult {
  const extension = fileName.split('.').pop()?.toUpperCase() || 'unknown';

  return {
    type: 'unsupported_format',
    message: `Unsupported file format: .${extension}. We currently support: ${supportedFormats.join(', ')}.`,
    retryable: true,
    suggestions: [
      'Convert your file to a supported format first',
      `Supported formats: ${supportedFormats.slice(0, 8).join(', ')}...`,
      'Try exporting your file as PDF or DOCX from your original application',
    ],
  };
}

export function handleConversionFailed(
  sourceFormat: string,
  targetFormat: string,
  reason?: string
): FileErrorResult {
  return {
    type: 'conversion_failed',
    message: `Could not convert from ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}. ${reason || 'The conversion process encountered an error.'}`,
    retryable: true,
    suggestions: [
      'Try converting to PDF first, then to your desired format',
      'Check if the source file is valid and not password-protected',
      'Try a different conversion path (e.g., DOCX → PDF → target)',
      'Ensure the file is not corrupted',
    ],
  };
}

export function handleCorruptedFile(fileName: string): FileErrorResult {
  return {
    type: 'corrupted',
    message: `The file "${fileName}" appears to be corrupted or unreadable. Please check the file and try again.`,
    retryable: false,
    suggestions: [
      'Try opening the file in its original application to verify it works',
      'Re-save the file from the original application',
      'Try a different file if available',
    ],
  };
}
