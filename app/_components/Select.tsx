'use client';

import { useState, useRef, useEffect } from 'react';
import sl from '@/styles/components/Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({ value, onChange, options, placeholder, className, disabled }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const current = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{position:'relative'}} className={className}>
      <button
        type="button"
        className={`${sl.trigger} ${sl.soft}`}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        style={{cursor:disabled?'default':'pointer'}}
      >
        <span style={{color:current?'var(--color-text)':'var(--color-text-muted)'}}>
          {current?.label || placeholder || 'Select...'}
        </span>
        <span className={`${sl.chevron} ${open ? sl.openChevron : ''}`}>▼</span>
      </button>
      {open && (
        <div className={`${sl.menu} ${sl.menuSoft}`} style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,minWidth:'100%'}}>
          {options.map(opt => (
            <div
              key={opt.value}
              className={`${sl.option} ${sl.optionSoft}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{fontWeight:opt.value===value?'var(--weight-semibold)':'var(--weight-regular)'}}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
