'use client';

import { ReactNode, useState } from 'react';

interface QuickActionsSearchProps {
  onSearch?: (term: string) => void;
}

const allTools = [
  { label: 'Generate', route: '/generate' },
  { label: 'Convert', route: '/convert' },
  { label: 'Translate', route: '/translate' },
  { label: 'Voice', route: '/voice' },
  { label: 'Extract', route: '/extract-text-from-pdf' },
  { label: 'Merge', route: '/merge-pdf' },
  { label: 'Split', route: '/split-pdf' },
  { label: 'Compress', route: '/compress-pdf' },
  { label: 'Style', route: '/change-style' },
];

export function QuickActionsSearch({
  onSearch,
}: QuickActionsSearchProps): ReactNode {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTools, setFilteredTools] = useState(allTools);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredTools(allTools);
    } else {
      const filtered = allTools.filter((tool) =>
        tool.label.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTools(filtered);
    }
    onSearch?.(term);
  };

  return (
    <div className="quick-actions-search">
      <input
        type="text"
        placeholder="Search tools..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />
      {filteredTools.length === 0 && (
        <p className="no-results">No tools found</p>
      )}
    </div>
  );
}