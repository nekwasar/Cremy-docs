'use client';

import Link from 'next/link';
import s from '@/styles/components/Breadcrumb.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`${s.crumb} ${s.soft}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} style={{display:'inline-flex',alignItems:'center',gap:'var(--space-2)'}}>
            {index > 0 && <span className={s.separator}>/</span>}
            {isLast ? (
              <span className={s.current} aria-current="page">{item.label}</span>
            ) : item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}