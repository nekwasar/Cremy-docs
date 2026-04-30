import { validateAudioBlob } from './audio-validation';
import { transcribeWithWhisper } from '@/services/whisper';
import { formatTranscript } from './transcript-formatter';

interface AudioToTextResult {
  success: boolean;
  transcribedText?: string;
  formattedText?: string;
  error?: string;
  retryable: boolean;
}

export async function convertAudioToText(audioBlob: Blob): Promise<AudioToTextResult> {
  const validation = validateAudioBlob(audioBlob);
  if (!validation.valid) {
    return { success: false, error: validation.error, retryable: false };
  }

  try {
    const transcription = await transcribeWithWhisper(audioBlob);
    
    const formatted = formatTranscript(transcription);

    return {
      success: true,
      transcribedText: transcription,
      formattedText: formatted,
      retryable: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Transcription failed';
    const retryable = message.includes('timed out') || message.includes('API error');
    
    return {
      success: false,
      error: message,
      retryable,
    };
  }
}

export async function convertAudioFileToText(file: File): Promise<AudioToTextResult> {
  const { validateAudioFile } = await import('./audio-validation');
  const validation = validateAudioFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error, retryable: false };
  }

  const blob = new Blob([file], { type: file.type });
  return convertAudioToText(blob);
}
