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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content template-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Select a Category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/templates/${cat.id}`}
              className="category-card"
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
        <button className="modal-close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}