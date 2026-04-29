'use client';

import { useState } from 'react';

export function useSocket() {
  const [connected, setConnected] = useState(false);

  const connect = () => {
    setConnected(true);
  };

  const disconnect = () => {
    setConnected(false);
  };

  return { connected, connect, disconnect };
}

export function useDocument() {
  const [document, setDocument] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const fetchDocument = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/${id}`);
      const data = await response.json();
      if (data.success) {
        setDocument(data.data.document);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { document, loading, fetchDocument };
}