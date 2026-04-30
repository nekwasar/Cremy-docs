'use client';

import Link from 'next/link';
import { FORMATS } from '@/config/formats';

export function FormatGallery() {
  return (
    <div>
      <h2>Document Formats</h2>
      <div>
        {FORMATS.map((format) => (
          <Link key={format.id} href={`/format/${format.id}`}>
            <div>
              <h3>{format.name}</h3>
              <p>{format.description}</p>
              <span>{format.creditCost} credits</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}