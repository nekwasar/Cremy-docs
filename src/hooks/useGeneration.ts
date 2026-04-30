'use client';

import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useGenerateStore } from '@/store/generate-store';

interface UseGenerationOptions {
  socket: Socket | null;
}

interface UseGenerationReturn {
  generate: (text: string, structure?: string, templateId?: string) => Promise<void>;
  cancel: () => void;
  isGenerating: boolean;
}

export function useGeneration({ socket }: UseGenerationOptions): UseGenerationReturn {
  const {
    setGenerating,
    setGeneratedDocumentId,
    setStreaming,
    appendStreamContent,
    resetStreamContent,
    preserveInputForRegeneration,
  } = useGenerateStore();

  const generate = useCallback(
    async (text: string, structure?: string, templateId?: string) => {
      if (!socket?.connected) return;

      preserveInputForRegeneration();
      setGenerating(true);
      setStreaming(true);
      resetStreamContent();

      socket.emit('generate', {
        text,
        formatId: structure || 'auto',
        templateId,
      });

      socket.on('chunk', (data: { chunk: string }) => {
        appendStreamContent(data.chunk);
      });

      socket.on('start', () => {
        setStreaming(true);
      });

      socket.on('complete', (data: { document: { id: string } }) => {
        setGeneratedDocumentId(data.document.id);
        setGenerating(false);
        setStreaming(false);
        socket.off('chunk');
        socket.off('start');
        socket.off('complete');
        socket.off('error');
        socket.off('timeout');
      });

      socket.on('error', (data: { message: string }) => {
        setGenerating(false);
        setStreaming(false);
        socket.off('chunk');
        socket.off('start');
        socket.off('complete');
        socket.off('error');
        socket.off('timeout');
      });

      socket.on('timeout', () => {
        setGenerating(false);
        setStreaming(false);
        socket.off('chunk');
        socket.off('start');
        socket.off('complete');
        socket.off('error');
        socket.off('timeout');
      });
    },
    [socket, setGenerating, setGeneratedDocumentId, setStreaming, appendStreamContent, resetStreamContent, preserveInputForRegeneration]
  );

  const cancel = useCallback(() => {
    if (socket?.connected) {
      socket.emit('cancel');
    }
    setGenerating(false);
    setStreaming(false);
  }, [socket, setGenerating, setStreaming]);

  return { generate, cancel, isGenerating: useGenerateStore.getState().isGenerating };
}