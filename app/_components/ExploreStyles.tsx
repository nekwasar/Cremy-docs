'use client';

import Link from 'next/link';

export function ExploreStyles() {
  const categories = [
    { id: 'business', name: 'Business' },
    { id: 'academic', name: 'Academic' },
    { id: 'legal', name: 'Legal' },
    { id: 'personal', name: 'Personal' },
    { id: 'creative', name: 'Creative' },
  ];

  return (
    <div>
      <span>Explore Styles</span>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link href={`/templates/${cat.id}`}>{cat.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}