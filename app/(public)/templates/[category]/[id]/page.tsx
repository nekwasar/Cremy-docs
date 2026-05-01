'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

  if (loading) return <div>Loading...</div>;
  if (!template) return <div>Template not found</div>;

  return (
    <div>
      <Link href={`/templates/${category}`}>← Back to {category}</Link>

      <h1>{template.name}</h1>
      <p>{template.description}</p>
      <span>Format: {template.format}</span>

      <Link href={`/generate?template=${template._id}`}>Use Template</Link>

      <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
        Share
      </button>

      {related.length > 0 && (
        <section>
          <h2>Related Templates</h2>
          <div>
            {related.map((t) => (
              <Link key={t._id} href={`/templates/${t.category}/${t._id}`}>
                {t.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}