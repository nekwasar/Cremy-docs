'use client';

import Link from 'next/link';

interface ConvertBreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
}

export function ConvertBreadcrumb({ items }: ConvertBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
            {index < items.length - 1 && <span> / </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
