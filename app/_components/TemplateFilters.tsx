'use client';

interface TemplateFiltersProps {
  onSearch: (query: string) => void;
  onSort: (sort: string) => void;
  onFormat: (format: string) => void;
  onPremium: (premium: boolean | null) => void;
}

export function TemplateFilters({ onSearch, onSort, onFormat, onPremium }: TemplateFiltersProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search templates..."
        onChange={(e) => onSearch(e.target.value)}
      />
      <select onChange={(e) => onSort(e.target.value)}>
        <option value="popular">Popular</option>
        <option value="newest">Newest</option>
        <option value="name">Name A-Z</option>
      </select>
      <select onChange={(e) => onFormat(e.target.value)}>
        <option value="">All Formats</option>
        <option value="pdf">PDF</option>
        <option value="docx">DOCX</option>
        <option value="txt">TXT</option>
        <option value="md">Markdown</option>
      </select>
      <select onChange={(e) => {
        const val = e.target.value;
        onPremium(val === '' ? null : val === 'true');
      }}>
        <option value="">All</option>
        <option value="false">Free</option>
        <option value="true">Premium</option>
      </select>
    </div>
  );
}