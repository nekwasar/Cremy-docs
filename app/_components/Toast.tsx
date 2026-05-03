'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import t from '@/styles/components/Toast.module.css';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{position:'fixed',bottom:'var(--space-4)',right:'var(--space-4)',zIndex:200,display:'flex',flexDirection:'column',gap:'var(--space-2)'}}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${t.toast} ${t.soft} ${t.bottomRight}`}>
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className={t.dismiss}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}