import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Reduce PDF File Size Online — Compress PDF Free',
  description: 'Reduce PDF file size without losing quality. Compress PDF files online for free. Make PDFs smaller for email, upload, and storage.',
  path: '/reduce-pdf-size',
});

export default function ReducePdfSizePage() {
  return (
    <div>
      <h1>Reduce PDF File Size Online</h1>
      <p>Compress and reduce PDF file size without losing quality. Make your PDFs smaller for email, upload, and storage.</p>

      <Link href="/compress-pdf">Reduce PDF Size Now</Link>

      <div>
        <h2>Why Reduce PDF Size?</h2>
        <ul>
          <li>Fit within email attachment limits</li>
          <li>Upload faster to cloud storage</li>
          <li>Save storage space on your device</li>
          <li>Share documents more easily online</li>
        </ul>
      </div>

      <div>
        <h2>Related Tools</h2>
        <ul>
          <li><Link href="/compress-pdf">Compress PDF</Link></li>
          <li><Link href="/merge-pdf">Merge PDF</Link></li>
          <li><Link href="/split-pdf">Split PDF</Link></li>
        </ul>
      </div>
    </div>
  );
}