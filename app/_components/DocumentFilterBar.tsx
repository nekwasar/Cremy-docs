'use client';

import { useState } from 'react';

interface DocumentFilterBarProps {
  onSearch: (query: string) => void;
  onSort: (sort: string) => void;
  onFilter: (format: string) => void;
}

export function DocumentFilterBar({ onSearch, onSort, onFilter }: DocumentFilterBarProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search documents..."
        onChange={(e) => onSearch(e.target.value)}
      />
      <select onChange={(e) => onSort(e.target.value)}>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name">Name A-Z</option>
        <option value="format">By Format</option>
      </select>
      <select onChange={(e) => onFilter(e.target.value)}>
        <option value="">All Formats</option>
        <option value="pdf">PDF</option>
        <option value="docx">DOCX</option>
        <option value="txt">TXT</option>
        <option value="md">Markdown</option>
      </select>
    </div>
  );
}