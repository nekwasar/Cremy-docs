'use client';

import { useState } from 'react';

interface InputExpansionProps {
  defaultRows?: number;
  maxRows?: number;
}

export function useInputExpansion({
  defaultRows = 2,
  maxRows = 6,
}: InputExpansionProps = {}) {
  const [rows, setRows] = useState(defaultRows);
  const [isExpanded, setIsExpanded] = useState(false);

  const expand = () => {
    setIsExpanded(true);
    setRows(maxRows);
  };

  const collapse = () => {
    setIsExpanded(false);
    setRows(defaultRows);
  };

  const toggle = () => {
    if (isExpanded) {
      collapse();
    } else {
      expand();
    }
  };

  return { rows, isExpanded, expand, collapse, toggle };
}