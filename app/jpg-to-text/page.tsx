import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'JPG to Text Converter — Extract Text from JPG Free',
  description: 'Convert JPG images to editable text. Free online OCR for JPG photos and scanned documents. No registration, instant results.',
  path: '/jpg-to-text',
});

export default function JpgToTextPage() {
  return (
    <div>
      <h1>JPG to Text Converter</h1>
      <p>Extract text from JPG images and photos instantly with our free OCR tool.</p>

      <Link href="/extract-text-from-pdf">Convert JPG to Text Now</Link>

      <div>
        <h2>Perfect For</h2>
        <ul>
          <li>Photos of documents and receipts</li>
          <li>Scanned pages saved as JPG</li>
          <li>Screenshots containing text</li>
        </ul>
      </div>

      <div>
        <h2>Related Tools</h2>
        <ul>
          <li><Link href="/png-to-text">PNG to Text</Link></li>
          <li><Link href="/image-to-text">Image to Text</Link></li>
          <li><Link href="/pdf-to-text">PDF to Text</Link></li>
        </ul>
      </div>
    </div>
  );
}