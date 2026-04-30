import { convertAudioToText } from '@/lib/audio-to-text';

export async function handleVoice(
  audioBlob: Blob
): Promise<{ success: boolean; transcribedText?: string; formattedText?: string; error?: string }> {
  try {
    const result = await convertAudioToText(audioBlob);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      transcribedText: result.transcribedText,
      formattedText: result.formattedText,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
