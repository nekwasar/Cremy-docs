import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Extract PDF Pages Online — Separate PDF Pages Free',
  description: 'Extract specific pages from PDF documents. Separate PDF pages into individual files. Free online tool, no registration needed.',
  path: '/extract-pdf-pages',
});

export default function ExtractPdfPagesPage() {
  return (
    <div>
      <h1>Extract PDF Pages Online</h1>
      <p>Extract specific pages from any PDF document. Separate individual pages or page ranges instantly.</p>

      <Link href="/split-pdf">Extract PDF Pages Now</Link>

      <div>
        <h2>How It Works</h2>
        <ol>
          <li>Upload your PDF document</li>
          <li>Select which pages to extract</li>
          <li>Download individual pages as separate PDFs</li>
        </ol>
      </div>

      <div>
        <h2>Related Tools</h2>
        <ul>
          <li><Link href="/split-pdf">Split PDF</Link></li>
          <li><Link href="/merge-pdf">Merge PDF</Link></li>
          <li><Link href="/combine-pdf">Combine PDF</Link></li>
        </ul>
      </div>
    </div>
  );
}