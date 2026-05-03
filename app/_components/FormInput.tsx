'use client';

import { useState } from 'react';
import i from '@/styles/components/Input.module.css';
import f from '@/styles/components/FormGroup.module.css';

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
    <div className={f.group}>
      <label htmlFor={name} className={f.label}>
        {label}
        {required && <span className={f.required}>*</span>}
      </label>
      <input
        id={name}
        className={`${i.input} ${i.soft}`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        aria-invalid={showError ? 'true' : 'false'}
        aria-describedby={showError ? `${name}-error` : undefined}
      />
      {showError && (
        <span id={`${name}-error`} role="alert" className={f.error}>
          {error}
        </span>
      )}
    </div>
  );
}