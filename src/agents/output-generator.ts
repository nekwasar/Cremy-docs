interface ToolOutput {
  type: 'generate_text' | 'generate_command' | 'convert' | 'translate' | 'voice' | 'extract' | 'merge' | 'split' | 'compress' | 'change_style' | 'edit';
  success: boolean;
  message: string;
  documentId?: string;
  previewContent?: string;
  beforeContent?: string;
  afterContent?: string;
  originalSize?: number;
  compressedSize?: number;
  wordCount?: number;
  detectedFormat?: string;
  extractedText?: string;
  error?: string;
  extra?: Record<string, unknown>;
}

export function formatOutput(toolId: string, result: any): ToolOutput {
  const base: ToolOutput = {
    type: toolId as ToolOutput['type'],
    success: result.success ?? false,
    message: result.success ? 'Operation completed successfully.' : (result.error || 'Operation failed.'),
    error: result.error,
  };

  switch (toolId) {
    case 'generate_command':
    case 'generate_text':
      return {
        ...base,
        documentId: result.documentId,
        previewContent: result.preview,
        wordCount: result.wordCount,
        detectedFormat: result.detectedFormat,
      };
    case 'convert':
      return {
        ...base,
        documentId: result.documentId,
        beforeContent: result.before,
        afterContent: result.after,
        message: result.success ? '100% quality as promised — your file content is unchanged.' : base.message,
      };
    case 'translate':
      return {
        ...base,
        documentId: result.documentId,
        previewContent: result.translatedText,
        beforeContent: result.originalText,
        afterContent: result.translatedText,
      };
    case 'voice':
      return {
        ...base,
        documentId: result.documentId,
        previewContent: result.formattedText,
        beforeContent: result.transcribedText,
      };
    case 'extract':
      return {
        ...base,
        extractedText: result.extractedText,
        message: result.success ? 'Text extracted successfully. Use Copy to copy the text.' : base.message,
      };
    case 'merge':
    case 'split':
      return {
        ...base,
        documentId: result.documentId,
        message: result.success ? 'Operation completed. Preview and download are ready.' : base.message,
      };
    case 'compress':
      return {
        ...base,
        documentId: result.documentId,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        message: result.success
          ? `Compressed from ${formatSize(result.originalSize)} to ${formatSize(result.compressedSize)}.`
          : base.message,
      };
    case 'change_style':
      return {
        ...base,
        documentId: result.documentId,
        previewContent: result.styled,
        beforeContent: result.original,
      };
    case 'edit':
      return {
        ...base,
        documentId: result.documentId,
        previewContent: result.edited,
        beforeContent: result.original,
      };
    default:
      return base;
  }
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}
