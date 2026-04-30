const WHISPER_API_URL = process.env.WHISPER_API_URL || 'http://localhost:9000';

interface WhisperResponse {
  text: string;
  segments?: Array<{
    text: string;
    start: number;
    end: number;
  }>;
}

export async function transcribeWithWhisper(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');
  formData.append('language', 'en');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${WHISPER_API_URL}/inference`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
    }

    const data: WhisperResponse = await response.json();

    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No speech detected in the recording');
    }

    return data.text.trim();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Transcription timed out after 30 seconds');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function checkWhisperHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${WHISPER_API_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
