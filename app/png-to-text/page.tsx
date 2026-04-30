import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'PNG to Text Converter — Extract Text from PNG Free',
  description: 'Convert PNG images to editable text. Free OCR for PNG screenshots and graphics. No registration needed. Instant text extraction.',
  path: '/png-to-text',
});

export default function PngToTextPage() {
  return (
    <div>
      <h1>PNG to Text Converter</h1>
      <p>Extract text from PNG images, screenshots, and graphics with our free online OCR tool.</p>

      <Link href="/extract-text-from-pdf">Convert PNG to Text Now</Link>

      <div>
        <h2>Perfect For</h2>
        <ul>
          <li>Screenshots of documents and web pages</li>
          <li>Graphics and infographics with embedded text</li>
          <li>Scanned documents saved as PNG</li>
        </ul>
      </div>

      <div>
        <h2>Related Tools</h2>
        <ul>
          <li><Link href="/jpg-to-text">JPG to Text</Link></li>
          <li><Link href="/image-to-text">Image to Text</Link></li>
          <li><Link href="/pdf-to-text">PDF to Text</Link></li>
        </ul>
      </div>
    </div>
  );
}