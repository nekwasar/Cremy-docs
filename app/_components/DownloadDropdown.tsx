'use client';

import { useState, useRef, useEffect } from 'react';

interface DownloadOption {
  format: string;
  label: string;
}

const FORMATS: DownloadOption[] = [
  { format: 'pdf', label: 'PDF' },
  { format: 'docx', label: 'Word Document' },
  { format: 'txt', label: 'Plain Text' },
  { format: 'md', label: 'Markdown' },
];

interface Props {
  documentId: string;
  onDownload?: (format: string) => void;
}

export function DownloadDropdown({ documentId, onDownload }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async (format: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download?format=${format}`);
      const data = await response.json();

      if (data.success) {
        window.location.href = data.data.url;
        onDownload?.(format);
      }
    } catch (error) {
      console.error(error);
    }

    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef}>
      <button 
       
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        Download ▾
      </button>

      {isOpen && (
        <ul>
          {FORMATS.map((option) => (
            <li key={option.format}>
              <button onClick={() => handleDownload(option.format)}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}