'use client';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, placeholder = 'Search...', isLoading = false }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        disabled={isLoading}
      />
      {isLoading && <span>Searching...</span>}
    </div>
  );
}