'use client';

import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { generateElementId } from '@/lib/element-id';

interface UseAIEditOptions {
  socket: Socket | null;
  documentId: string;
}

interface UseAIEditReturn {
  executeEdit: (instruction: string, targetElementId?: string) => Promise<void>;
  isEditing: boolean;
}

export function useAIEdit({ socket, documentId }: UseAIEditOptions): UseAIEditReturn {
  const executeEdit = useCallback(
    async (instruction: string, targetElementId?: string) => {
      if (!socket?.connected || !documentId) return;

      return new Promise<void>((resolve) => {
        socket.emit('edit', {
          documentId,
          instruction: targetElementId
            ? `Focus on element ${targetElementId}: ${instruction}`
            : instruction,
        });

        const newElementIds = new Set<string>();

        socket.on('chunk', (data: { chunk: string }) => {
          newElementIds.add(generateElementId('ai-edit'));
        });

        socket.on('complete', () => {
          socket.off('chunk');
          socket.off('complete');
          socket.off('error');
          resolve();
        });

        socket.on('error', () => {
          socket.off('chunk');
          socket.off('complete');
          socket.off('error');
          resolve();
        });
      });
    },
    [socket, documentId]
  );

  return { executeEdit, isEditing: false };
}