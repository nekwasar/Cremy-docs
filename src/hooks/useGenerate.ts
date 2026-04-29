'use client';

import { useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';

interface GeneratePayload {
  text: string;
  formatId?: string;
  tone?: string;
  templateId?: string;
}

interface UseGenerateOptions {
  socket: Socket | null;
}

interface UseGenerateReturn {
  generate: (payload: GeneratePayload) => Promise<any>;
  isGenerating: boolean;
  error: string | null;
}

export function useGenerate({ socket }: UseGenerateOptions): UseGenerateReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (payload: GeneratePayload) => {
    if (!socket?.connected) {
      setError('Not connected');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    return new Promise((resolve) => {
      socket.emit('generate', payload);

      socket.once('complete', (data) => {
        setIsGenerating(false);
        resolve(data.document);
      });

      socket.once('error', (data) => {
        setIsGenerating(false);
        setError(data.message);
        resolve(null);
      });

      socket.once('timeout', () => {
        setIsGenerating(false);
        setError('Generation timed out');
        resolve(null);
      });
    });
  }, [socket]);

  return { generate, isGenerating, error };
}