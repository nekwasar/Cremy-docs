'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';

interface UseStreamingOptions {
  socket: Socket | null;
}

interface UseStreamingReturn {
  content: string;
  progress: number;
  isStreaming: boolean;
}

export function useStreaming({ socket }: UseStreamingOptions): UseStreamingReturn {
  const [content, setContent] = useState('');
  const [progress, setProgress] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const contentRef = useRef('');

  useEffect(() => {
    if (!socket) return;

    const handleChunk = (data: { chunk: string; progress?: number }) => {
      contentRef.current += data.chunk;
      setContent(contentRef.current);
      if (data.progress !== undefined) {
        setProgress(data.progress);
      }
    };

    const handleStart = () => {
      setIsStreaming(true);
      contentRef.current = '';
      setContent('');
      setProgress(0);
    };

    const handleComplete = () => {
      setIsStreaming(false);
      setProgress(100);
    };

    const handleTimeout = () => {
      setIsStreaming(false);
    };

    socket.on('chunk', handleChunk);
    socket.on('start', handleStart);
    socket.on('complete', handleComplete);
    socket.on('timeout', handleTimeout);

    return () => {
      socket.off('chunk', handleChunk);
      socket.off('start', handleStart);
      socket.off('complete', handleComplete);
      socket.off('timeout', handleTimeout);
    };
  }, [socket]);

  return { content, progress, isStreaming };
}