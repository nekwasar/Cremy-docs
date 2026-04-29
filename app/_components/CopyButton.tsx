'use client';

import { useState } from 'react';

interface Props {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = 'Copy' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button onClick={handleCopy}>
      {copied ? 'Copied!' : label}
    </button>
  );
}