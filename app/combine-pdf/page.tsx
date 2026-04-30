import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Combine PDF Files Online — Free PDF Combiner',
  description: 'Combine multiple PDF files into one document for free. Merge PDFs online without registration. Fast, secure, and preserves quality.',
  path: '/combine-pdf',
});

export default function CombinePdfPage() {
  return (
    <div>
      <h1>Combine PDF Files Online</h1>
      <p>Combine multiple PDFs into a single document. Free, fast, and no registration required.</p>

      <Link href="/merge-pdf">Combine PDF Files Now</Link>

      <div>
        <h2>Why Combine PDFs?</h2>
        <ul>
          <li>Merge multiple reports into one document</li>
          <li>Combine scanned pages into a single PDF</li>
          <li>Create a single file from multiple sources</li>
          <li>Organize your documents efficiently</li>
        </ul>
      </div>

      <div>
        <h2>Related Tools</h2>
        <ul>
          <li><Link href="/merge-pdf">Merge PDF</Link></li>
          <li><Link href="/split-pdf">Split PDF</Link></li>
          <li><Link href="/compress-pdf">Compress PDF</Link></li>
        </ul>
      </div>
    </div>
  );
}