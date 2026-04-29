'use client';

import { useCallback, useState } from 'react';

interface FormValues {
  [key: string]: unknown;
}

interface UseFormResetReturn<T extends FormValues> {
  reset: (values?: Partial<T>) => void;
  isReset: boolean;
  initialValues: T;
}

export function useFormReset<T extends FormValues>(initialValues: T): UseFormResetReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [isReset, setIsReset] = useState(false);

  const reset = useCallback((newValues?: Partial<T>) => {
    setValues({ ...initialValues, ...newValues });
    setIsReset(true);
    setTimeout(() => setIsReset(false), 200);
  }, [initialValues]);

  return {
    reset,
    isReset,
    initialValues: values,
  };
}