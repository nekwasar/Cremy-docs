import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'PDF to Text Converter — Extract Text from PDF Free',
  description: 'Convert PDF to text instantly. Extract text from any PDF document with our free online tool. Preserves formatting and structure. No registration needed.',
  path: '/pdf-to-text',
});

export default function PdfToTextPage() {
  return (
    <div>
      <h1>PDF to Text Converter</h1>
      <p>Extract text from any PDF document instantly. Free, fast, and preserves document structure.</p>

      <Link href="/extract-text-from-pdf">Convert PDF to Text Now</Link>

      <div>
        <h2>Why Convert PDF to Text?</h2>
        <ul>
          <li>Make PDFs searchable and editable</li>
          <li>Extract content for data processing</li>
          <li>Copy text from scanned documents</li>
          <li>Preserve all text content from your PDFs</li>
        </ul>
      </div>

      <div>
        <h2>Related Tools</h2>
        <ul>
          <li><Link href="/extract-text">Extract Text Tool</Link></li>
          <li><Link href="/image-to-text">Image to Text</Link></li>
          <li><Link href="/scanned-pdf-to-text">Scanned PDF to Text</Link></li>
        </ul>
      </div>
    </div>
  );
}