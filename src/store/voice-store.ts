import { create } from 'zustand';

type RecordingStatus = 'idle' | 'recording' | 'processing';

interface VoiceState {
  recordingStatus: RecordingStatus;
  audioBlob: Blob | null;
  transcribedText: string | null;
  formattedText: string | null;
  duration: number;
  documentId: string | null;
  error: string | null;
  inputMode: 'record' | 'upload';
  setStatus: (status: RecordingStatus) => void;
  setAudioBlob: (blob: Blob | null) => void;
  setTranscribedText: (text: string | null) => void;
  setFormattedText: (text: string | null) => void;
  setDuration: (duration: number | ((prev: number) => number)) => void;
  setDocumentId: (id: string | null) => void;
  setError: (error: string | null) => void;
  setInputMode: (mode: 'record' | 'upload') => void;
  reset: () => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  recordingStatus: 'idle',
  audioBlob: null,
  transcribedText: null,
  formattedText: null,
  duration: 0,
  documentId: null,
  error: null,
  inputMode: 'record',

  setStatus: (status) => set({ recordingStatus: status }),
  setAudioBlob: (blob) => set({ audioBlob: blob }),
  setTranscribedText: (text) => set({ transcribedText: text }),
  setFormattedText: (text) => set({ formattedText: text }),
  setDuration: (duration) => set((state) => ({ duration: typeof duration === 'function' ? duration(state.duration) : duration })),
  setDocumentId: (id) => set({ documentId: id }),
  setError: (error) => set({ error }),
  setInputMode: (mode) => set({ inputMode: mode }),

  reset: () =>
    set({
      recordingStatus: 'idle',
      audioBlob: null,
      transcribedText: null,
      formattedText: null,
      duration: 0,
      documentId: null,
      error: null,
    }),
}));