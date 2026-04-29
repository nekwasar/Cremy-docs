'use client';

import { useState, useRef, useEffect } from 'react';

interface ExpandableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  maxHeight?: number;
  disabled?: boolean;
}

export function ExpandableTextarea({
  value,
  onChange,
  placeholder = '',
  minRows = 2,
  maxRows = 6,
  maxHeight = 300,
  disabled = false,
}: ExpandableTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rows = isFocused ? maxRows : minRows;

  useEffect(() => {
    if (textareaRef.current && isFocused) {
      textareaRef.current.focus();
    }
  }, [isFocused]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      style={{ maxHeight: `${maxHeight}px`, resize: 'none' }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
}