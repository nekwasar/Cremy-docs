'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import c from '@/styles/components/Card.module.css';
import i from '@/styles/components/Input.module.css';

interface Template {
  _id: string;
  name: string;
  description: string;
  category: string;
  format: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data.templates);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = templates.filter((t) => {
    return !search || t.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ maxWidth: 'var(--container-lg)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <h1 style={{ marginBottom: 'var(--space-6)' }}>Templates</h1>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <input
          className={`${i.input} ${i.soft}`}
          style={{ flex: 1, minWidth: 200 }}
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? null : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          {filtered.map((template) => (
            <Link key={template._id} href={`/templates/${template.category}/${template._id}`} className={c.card} style={{ display: 'block', textDecoration: 'none', padding: 'var(--space-4)' }}>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>{template.name}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                {template.description}
              </p>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {template.format}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--color-text-secondary)' }}>No templates found</p>
      )}
    </div>
  );
}
