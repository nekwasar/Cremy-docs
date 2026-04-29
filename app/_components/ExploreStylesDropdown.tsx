'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const STYLES = [
  { name: 'Business', slug: 'business' },
  { name: 'Academic', slug: 'academic' },
  { name: 'Legal', slug: 'legal' },
  { name: 'Personal', slug: 'personal' },
  { name: 'Creative', slug: 'creative' },
];

export function ExploreStylesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Explore Styles ▾
      </button>

      {isOpen && (
        <div>
          <ul>
            {STYLES.map((style) => (
              <li key={style.slug}>
                <Link href={`/templates/${style.slug}`}>
                  {style.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}