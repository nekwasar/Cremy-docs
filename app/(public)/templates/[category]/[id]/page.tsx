'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

interface Template {
  _id: string;
  name: string;
  description: string;
  category: string;
  format: string;
  content?: string;
}

export default function TemplateDetailPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const id = searchParams.get('id') || '';
  const [template, setTemplate] = useState<Template | null>(null);
  const [related, setRelated] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${id}`);
      const data = await response.json();
      if (data.success) {
        setTemplate(data.data.template);
        setRelated(data.data.related || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (!template) return <div style={{ maxWidth: 'var(--container-lg)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>Template not found</div>;

  return (
    <div style={{ maxWidth: 'var(--container-lg)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <Link
        href={`/templates/${category}`}
        style={{ display: 'inline-block', marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}
      >
        ← Back to {category}
      </Link>

      <div className={c.card} style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>{template.name}</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
          {template.description}
        </p>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          Format: {template.format}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Link href={`/generate?template=${template._id}`} className={`${b.btn} ${b.soft}`}>
          Use Template
        </Link>

        <button className={`${b.btn} ${b.raw}`} onClick={() => navigator.clipboard.writeText(window.location.href)}>
          Share
        </button>
      </div>

      {related.length > 0 && (
        <section>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Related Templates</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
            {related.map((t) => (
              <Link
                key={t._id}
                href={`/templates/${t.category}/${t._id}`}
                className={c.card}
                style={{ display: 'block', textDecoration: 'none', padding: 'var(--space-3)' }}
              >
                {t.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
