'use client';

import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useGenerateStore } from '@/store/generate-store';

interface UseRegenerationOptions {
  socket: Socket | null;
}

interface UseRegenerationReturn {
  regenerate: () => Promise<void>;
  canRegenerate: boolean;
}

export function useRegeneration({ socket }: UseRegenerationOptions): UseRegenerationReturn {
  const { originalInput, selectedStructure, selectedTemplate, setGenerating, resetStreamContent } =
    useGenerateStore();

  const regenerate = useCallback(async () => {
    if (!socket?.connected || !originalInput) return;

    setGenerating(true);
    resetStreamContent();

    socket.emit('generate', {
      text: originalInput,
      formatId: selectedStructure || 'auto',
      templateId: selectedTemplate,
    });

    socket.on('complete', () => {
      setGenerating(false);
      socket.off('complete');
      socket.off('error');
    });

    socket.on('error', () => {
      setGenerating(false);
      socket.off('complete');
      socket.off('error');
    });
  }, [socket, originalInput, selectedStructure, selectedTemplate, setGenerating, resetStreamContent]);

  return { regenerate, canRegenerate: !!originalInput };
}