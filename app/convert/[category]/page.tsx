import Link from 'next/link';
import { getPairsByCategory, getCategoryLabels } from '@/config/convert-pairs';

export default function ConvertCategoryPage({ params }: { params: { category: string } }) {
  const pairs = getPairsByCategory(params.category);
  const labels = getCategoryLabels();
  const categoryLabel = labels[params.category] || params.category;

  return (
    <div>
      <Link href="/convert">← All Conversion Categories</Link>
      <h1>{categoryLabel} Conversions</h1>

      {pairs.length === 0 ? (
        <p>No conversions found for this category.</p>
      ) : (
        <ul>
          {pairs.map((pair) => (
            <li key={pair.slug}>
              <Link href={`/convert/${pair.slug}`}>
                Convert {pair.sourceLabel} to {pair.targetLabel}
              </Link>
              {pair.priority >= 90 && <span>Popular</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const { getCategoryLabels } = await import('@/config/convert-pairs');
  return Object.keys(getCategoryLabels()).map((category) => ({ category }));
}
