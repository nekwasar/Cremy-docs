'use client';

import { useEffect, useRef } from 'react';
import { useDocumentStore } from '../store';

interface AutoSaveOptions {
  enabled?: boolean;
  intervalMs?: number;
  onSave?: (doc: unknown) => void;
}

export function useDocumentAutoSave({
  enabled = true,
  intervalMs = 30000, // 30 seconds
  onSave,
}: AutoSaveOptions = {}) {
  const { currentDocument, setCurrentDocument } = useDocumentStore();
  const lastSavedRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled || !currentDocument) return;

    const save = () => {
      if (currentDocument) {
        try {
          const key = `cremy-doc-${currentDocument.id}`;
          localStorage.setItem(key, JSON.stringify(currentDocument));
          lastSavedRef.current = Date.now();
          onSave?.(currentDocument);
        } catch {
          // Ignore storage errors
        }
      }
    };

    const interval = setInterval(save, intervalMs);
    return () => clearInterval(interval);
  }, [currentDocument, enabled, intervalMs, onSave]);

  const manualSave = () => {
    if (currentDocument) {
      try {
        const key = `cremy-doc-${currentDocument.id}`;
        localStorage.setItem(key, JSON.stringify(currentDocument));
        lastSavedRef.current = Date.now();
      } catch {
        // Ignore
      }
    }
  };

  return { lastSaved: lastSavedRef.current, manualSave };
}