'use client';

import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useFormatStore } from '@/store/format-store';
import { getFormatPrompt, applyPromptTemplate } from '@/config/format-prompts';

interface UseFormatGenerationOptions {
  socket: Socket | null;
}

interface UseFormatGenerationReturn {
  generate: (text: string, formatId: string) => Promise<void>;
  cancel: () => void;
  isGenerating: boolean;
}

export function useFormatGeneration({ socket }: UseFormatGenerationOptions): UseFormatGenerationReturn {
  const { setGenerating, setGeneratedDocumentId, setError } = useFormatStore();

  const generate = useCallback(
    async (text: string, formatId: string) => {
      if (!socket?.connected) return;

      const formatPrompt = getFormatPrompt(formatId);
      if (!formatPrompt) {
        setError('Format not found');
        return;
      }

      setGenerating(true);
      setError(null);

      const fullPrompt = applyPromptTemplate(formatPrompt.userPromptTemplate, text);

      socket.emit('generate', {
        text: fullPrompt,
        formatId,
        templateId: null,
      });

      socket.on('complete', (data: { document: { id: string } }) => {
        setGeneratedDocumentId(data.document.id);
        setGenerating(false);
        socket.off('complete');
        socket.off('chunk');
        socket.off('error');
        socket.off('timeout');
      });

      socket.on('error', (data: { message: string }) => {
        setError(data.message);
        setGenerating(false);
        socket.off('complete');
        socket.off('chunk');
        socket.off('error');
        socket.off('timeout');
      });

      socket.on('timeout', () => {
        setError('Generation timed out');
        setGenerating(false);
        socket.off('complete');
        socket.off('chunk');
        socket.off('error');
        socket.off('timeout');
      });
    },
    [socket, setGenerating, setGeneratedDocumentId, setError]
  );

  const cancel = useCallback(() => {
    if (socket?.connected) {
      socket.emit('cancel');
    }
    setGenerating(false);
  }, [socket, setGenerating]);

  return { generate, cancel, isGenerating: false };
}