'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface TemplateOption {
  id: string;
  name: string;
  category: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (templateId: string) => void;
}

const categories = [
  { id: 'business', name: 'Business' },
  { id: 'academic', name: 'Academic' },
  { id: 'legal', name: 'Legal' },
  { id: 'personal', name: 'Personal' },
  { id: 'creative', name: 'Creative' },
];

export function TemplateModal({
  isOpen,
  onClose,
  onSelect,
}: TemplateModalProps): ReactNode | null {
  if (!isOpen) return null;

  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',background:'color-mix(in srgb, var(--color-page-bg) 40%, transparent)'}}>
      <div onClick={(e) => e.stopPropagation()} style={{background:'var(--color-modal-bg)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'var(--space-8)',maxWidth:'400px',width:'100%',margin:'var(--space-4)'}}>
        <h2>Select a Category</h2>
        <div>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/templates/${cat.id}`}
             
              onClick={(e) => {
                if (onSelect) {
                  e.preventDefault();
                  onSelect(cat.id);
                }
              }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <button onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}