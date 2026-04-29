'use client';

import { useState, useEffect, useCallback } from 'react';

interface SessionTimeoutProps {
  timeoutMs?: number;
  onTimeout?: () => void;
  onWarning?: () => void;
}

export function useSessionTimeout({
  timeoutMs = 30 * 60 * 1000, // 30 minutes
  onTimeout,
  onWarning,
}: SessionTimeoutProps = {}) {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isWarning, setIsWarning] = useState(false);

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    setIsWarning(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    onTimeout?.();
  }, [onTimeout]);

  useEffect(() => {
    const handleActivity = () => resetTimer();

    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [resetTimer]);

  useEffect(() => {
    const checkTimeout = () => {
      const elapsed = Date.now() - lastActivity;
      if (elapsed >= timeoutMs) {
        handleLogout();
      } else if (elapsed >= timeoutMs - 5 * 60 * 1000 && !isWarning) {
        setIsWarning(true);
        onWarning?.();
      }
    };

    const interval = setInterval(checkTimeout, 1000);
    return () => clearInterval(interval);
  }, [lastActivity, timeoutMs, handleLogout, isWarning, onWarning]);

  return { lastActivity, isWarning, resetTimer };
}