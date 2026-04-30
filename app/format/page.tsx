import Link from 'next/link';
import { FORMAT_CATEGORIES } from '@/config/formats';

export default function FormatIndexPage() {
  return (
    <div>
      <h1>Document Formats</h1>
      <p>Choose a format to create professional documents with AI.</p>

      {FORMAT_CATEGORIES.map((category) => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <div>
            {category.formats.map((format) => (
              <div key={format.id}>
                <Link href={`/format/${format.id}`}>
                  <h3>{format.name}</h3>
                </Link>
                <p>{format.description}</p>
                <span>{format.creditCost} credits</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}