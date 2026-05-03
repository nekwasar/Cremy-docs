import Link from 'next/link';
import { FORMAT_CATEGORIES } from '@/config/formats';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export default function FormatIndexPage() {
  return (
    <div style={{ maxWidth: 'var(--container-lg)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <h1>Document Formats</h1>
      <p style={{ marginBottom: 'var(--space-6)', color: 'var(--color-text-secondary)' }}>
        Choose a format to create professional documents with AI.
      </p>

      {FORMAT_CATEGORIES.map((category) => (
        <div key={category.id} style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>{category.name}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {category.formats.map((format) => (
              <Link key={format.id} href={`/format/${format.id}`} className={c.card} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ padding: 'var(--space-5)' }}>
                  <h3>{format.name}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 'var(--space-2) 0' }}>
                    {format.description}
                  </p>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {format.creditCost} credits
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
