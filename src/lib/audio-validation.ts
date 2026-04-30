const SUPPORTED_FORMATS = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/webm'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface ValidationResult {
  valid: boolean;
  error?: string;
  format?: string;
}

export function validateAudioFile(file: File): ValidationResult {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const supportedExtensions = ['mp3', 'wav', 'm4a', 'webm', 'ogg'];
  
  if (extension && !supportedExtensions.includes(extension)) {
    return { valid: false, error: `Unsupported format: .${extension}. Accepted: MP3, WAV, M4A` };
  }

  const isSupported = SUPPORTED_FORMATS.some(
    (fmt) => file.type === fmt || file.type.startsWith('audio/')
  );
  
  if (!isSupported && file.type) {
    return { valid: false, error: `Unsupported audio format: ${file.type}. Accepted: MP3, WAV, M4A` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 10MB`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'Audio file is empty' };
  }

  return { valid: true, format: file.type || extension };
}

export function validateAudioBlob(blob: Blob): ValidationResult {
  if (blob.size === 0) {
    return { valid: false, error: 'Recording is empty' };
  }

  if (blob.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Recording too large: ${(blob.size / 1024 / 1024).toFixed(1)}MB`,
    };
  }

  return { valid: true, format: blob.type };
}
