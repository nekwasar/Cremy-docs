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
}

export default function TemplatesCategoryPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetchTemplates();
    }
  }, [category]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/templates?category=${category}`);
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

  return (
    <div className="templates-category-page">
      <div className="page-header">
        <Link href="/templates">← All Templates</Link>
        <h1>{category} Templates</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : templates.length > 0 ? (
        <div className="template-grid">
          {templates.map((template) => (
            <Link
              key={template._id}
              href={`/templates/${category}/${template._id}`}
              className="template-card"
            >
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <span className="template-format">{template.format}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p>No templates in this category.</p>
      )}
    </div>
  );
}