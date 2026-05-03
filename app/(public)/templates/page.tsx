'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Template {
  _id: string;
  name: string;
  description: string;
  category: string;
  format: string;
}

const CATEGORIES = ['Business', 'Academic', 'Legal', 'Personal', 'Creative'];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
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
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || t.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h1>Templates</h1>

      <div>
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? null : filtered.length > 0 ? (
        <div>
          {filtered.map((template) => (
            <Link key={template._id} href={`/templates/${template.category}/${template._id}`}>
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <span>{template.format}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p>No templates found</p>
      )}
    </div>
  );
}