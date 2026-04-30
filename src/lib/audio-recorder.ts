interface AudioRecorderState {
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  stream: MediaStream | null;
}

let recorderState: AudioRecorderState = {
  mediaRecorder: null,
  audioChunks: [],
  stream: null,
};

export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}

export async function startRecording(): Promise<void> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorderState.stream = stream;
    recorderState.audioChunks = [];

    const mimeType = getSupportedMimeType();
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      audioBitsPerSecond: 128000,
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recorderState.audioChunks.push(event.data);
      }
    };

    recorderState.mediaRecorder = mediaRecorder;
    mediaRecorder.start();
  } catch (error) {
    throw new Error('Failed to start recording: ' + (error instanceof Error ? error.message : 'unknown'));
  }
}

export function stopRecording(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!recorderState.mediaRecorder) {
      reject(new Error('No active recording'));
      return;
    }

    recorderState.mediaRecorder.onstop = () => {
      const mimeType = recorderState.mediaRecorder?.mimeType || 'audio/webm';
      const blob = new Blob(recorderState.audioChunks, { type: mimeType });
      resolve(blob);
      cleanup();
    };

    recorderState.mediaRecorder.stop();
  });
}

export function cancelRecording(): void {
  if (recorderState.mediaRecorder && recorderState.mediaRecorder.state !== 'inactive') {
    recorderState.mediaRecorder.stop();
  }
  cleanup();
}

function cleanup(): void {
  if (recorderState.stream) {
    recorderState.stream.getTracks().forEach((track) => track.stop());
  }
  recorderState = { mediaRecorder: null, audioChunks: [], stream: null };
}

function getSupportedMimeType(): string {
  const types = [
    'audio/webm',
    'audio/mp4',
    'audio/wav',
    'audio/mpeg',
    'audio/ogg',
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'audio/webm';
}

export function getRecordingState(): 'inactive' | 'recording' | 'paused' {
  return recorderState.mediaRecorder?.state || 'inactive';
}
