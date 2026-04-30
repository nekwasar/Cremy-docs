import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Scanned PDF to Text — OCR for Scanned Documents Free',
  description: 'Convert scanned PDFs to searchable, editable text. Our AI-powered OCR handles handwritten and printed text in scanned documents.',
  path: '/scanned-pdf-to-text',
});

export default function ScannedPdfToTextPage() {
  return (
    <div>
      <h1>Scanned PDF to Text Converter</h1>
      <p>Extract text from scanned PDFs and documents. Our AI-powered OCR handles both printed and handwritten text.</p>

      <Link href="/extract-text-from-pdf">Convert Scanned PDF to Text Now</Link>

      <div>
        <h2>What We Handle</h2>
        <ul>
          <li>Scanned documents from flatbed scanners</li>
          <li>Photographed documents and receipts</li>
          <li>Both printed and handwritten text</li>
          <li>Multi-page scanned PDFs</li>
        </ul>
      </div>

      <div>
        <h2>Related Tools</h2>
        <ul>
          <li><Link href="/pdf-to-text">PDF to Text</Link></li>
          <li><Link href="/image-to-text">Image to Text</Link></li>
          <li><Link href="/extract-text">Extract Text Tool</Link></li>
        </ul>
      </div>
    </div>
  );
}