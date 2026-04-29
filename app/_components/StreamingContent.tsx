'use client';

import { useState, useEffect, useCallback } from 'react';

interface Chunk {
  id: string;
  text: string;
  timestamp: number;
}

interface StreamingContentProps {
  content: string;
  onChunk?: (chunk: string) => void;
  streamFrom?: string;
  enabled?: boolean;
}

export function StreamingContent({ content, onChunk, streamFrom, enabled = true }: StreamingContentProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const streamContent = useCallback(async () => {
    if (!content || !enabled) return;

    setIsStreaming(true);
    setDisplayedText('');
    setChunks([]);

    const words = content.split(' ');
    const newChunks: Chunk[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i] + (i < words.length - 1 ? ' ' : '');
      const chunk: Chunk = {
        id: `chunk-${i}`,
        text: word,
        timestamp: Date.now(),
      };

      newChunks.push(chunk);
      setChunks([...newChunks]);
      setDisplayedText((prev) => prev + word);

      if (onChunk) {
        onChunk(word);
      }

      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    setIsStreaming(false);
  }, [content, enabled, onChunk]);

  useEffect(() => {
    if (streamFrom && enabled) {
      streamContent();
    }
  }, [streamFrom, enabled, streamContent]);

  return (
    <div>
      <div>
        {displayedText}
        {isStreaming && <span>|</span>}
      </div>
      <div>
        <span>{chunks.length} chunks</span>
      </div>
    </div>
  );
}