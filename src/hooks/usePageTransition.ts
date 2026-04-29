'use client';

import { useTransition, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UsePageTransitionReturn {
  isPending: boolean;
  startTransition: <T>(promise: Promise<T>) => Promise<T>;
  navigate: (path: string) => void;
}

export function usePageTransition(): UsePageTransitionReturn {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isPending) {
      timeout = setTimeout(() => {
        setShowLoading(true);
      }, 300);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isPending]);

  const navigate = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };

  return {
    isPending: showLoading,
    startTransition: <T>(promise: Promise<T>): Promise<T> => {
      return new Promise((resolve) => {
        startTransition(async () => {
          const result = await promise;
          resolve(result);
        });
      });
    },
    navigate,
  };
}