'use client';

import { ReactNode } from 'react';
import { useUIStore } from '../../src/store';

interface SkeletonLoaderProps {
  type: 'text' | 'image' | 'button' | 'card';
  count?: number;
}

export function SkeletonLoader({ type, count = 1 }: SkeletonLoaderProps): ReactNode {
  const loaders = Array.from({ length: count }, (_, i) => (
    <div key={i} className={`skeleton skeleton-${type}`} />
  ));

  return <div className="skeleton-container">{loaders}</div>;
}