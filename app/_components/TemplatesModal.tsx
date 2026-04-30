'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Template {
  _id: string;
  name: string;
  description: string;
  category: string;
  format: string;
  isPremium: boolean;
}

interface TemplatesModalProps {
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

const CATEGORIES = [
  { id: 'business', name: 'Business' },
  { id: 'academic', name: 'Academic' },
  { id: 'legal', name: 'Legal' },
  { id: 'personal', name: 'Personal' },
  { id: 'creative', name: 'Creative' },
];

export function TemplatesModal({ onClose, onSelectTemplate }: TemplatesModalProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`/api/templates?category=${selectedCategory}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setTemplates(d.data.templates || []);
        });
    }
  }, [selectedCategory]);

  return (
    <div>
      <div>
        <h2>Select a Template</h2>
        <button onClick={onClose} type="button">✕</button>
      </div>
      {!selectedCategory ? (
        <div>
          <h3>Choose a Category</h3>
          <ul>
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => setSelectedCategory(cat.id)}>
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedCategory(null)}>← Back</button>
          {templates.length === 0 ? (
            <p>No templates in this category.</p>
          ) : (
            <ul>
              {templates.map((template) => (
                <li key={template._id}>
                  <button onClick={() => onSelectTemplate(template._id)}>
                    {template.name}
                  </button>
                  <p>{template.description}</p>
                  {template.isPremium && <span>Premium</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}