'use client';

interface CategoryFiltersProps {
  onSort: (sort: string) => void;
  onFormat: (format: string) => void;
  onPremium: (premium: boolean | null) => void;
  onClear: () => void;
  category: string;
}

export function CategoryFilters({ onSort, onFormat, onPremium, onClear, category }: CategoryFiltersProps) {
  return (
    <div>
      <h2>{category} Templates</h2>
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
      <button onClick={onClear}>Clear Filters</button>
    </div>
  );
}