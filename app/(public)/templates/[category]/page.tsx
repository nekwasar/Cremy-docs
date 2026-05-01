'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TemplateGrid } from '../../../_components/TemplateGrid';
import { CategoryFilters } from '../../../_components/CategoryFilters';
import { TemplatePreviewModal } from '../../../_components/TemplatePreviewModal';

interface TemplateItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  format: string;
  isPremium: boolean;
  usageCount: number;
}

export default function TemplatesCategoryPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [formatFilter, setFormatFilter] = useState('');
  const [premiumFilter, setPremiumFilter] = useState<boolean | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);

  useEffect(() => {
    if (category) {
      fetchTemplates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const fetchTemplates = async () => {
    setLoading(true);
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

  const filteredTemplates = templates
    .filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .filter((t) => {
      if (formatFilter) return t.format === formatFilter;
      return true;
    })
    .filter((t) => {
      if (premiumFilter !== null) return t.isPremium === premiumFilter;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return 0;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.usageCount || 0) - (a.usageCount || 0);
    });

  const mappedTemplates = filteredTemplates.map((t) => ({
    id: t._id,
    name: t.name,
    description: t.description,
    category: t.category,
    isPremium: t.isPremium,
    usageCount: t.usageCount || 0,
  }));

  const handleUseTemplate = (templateId: string) => {
    window.location.href = `/generate?template=${templateId}`;
  };

  return (
    <div>
      <Link href="/templates">← All Templates</Link>
      <h1>{category} Templates</h1>

      <CategoryFilters
        onSort={setSortBy}
        onFormat={setFormatFilter}
        onPremium={setPremiumFilter}
        onClear={() => {
          setSearchQuery('');
          setSortBy('popular');
          setFormatFilter('');
          setPremiumFilter(null);
        }}
        category={category}
      />

      <SearchBarLocal onSearch={setSearchQuery} />

      <TemplateGrid
        templates={mappedTemplates}
        onSelectTemplate={(template) => setSelectedTemplate(template as any)}
        isLoading={loading}
      />

      <TemplatePreviewModal
        template={selectedTemplate as any}
        onClose={() => setSelectedTemplate(null)}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
}

function SearchBarLocal({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <input
      type="text"
      placeholder="Search in this category..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}