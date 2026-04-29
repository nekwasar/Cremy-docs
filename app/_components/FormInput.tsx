'use client';

import { useState } from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required,
  placeholder,
}: FormInputProps) {
  const [touched, setTouched] = useState(false);

  const showError = touched && error;

  return (
    <div>
      <label htmlFor={name}>
        {label}
        {required && <span>*</span>}
      </label>
      <input
        id={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        aria-invalid={showError ? 'true' : 'false'}
        aria-describedby={showError ? `${name}-error` : undefined}
      />
      {showError && (
        <span id={`${name}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}