import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Extract Text from PDF and Images — Free Online OCR',
  description: 'Extract text from PDF, images, and scanned documents instantly. Free online OCR tool. No registration needed. Supports JPG, PNG, PDF, and scanned PDFs.',
  path: '/extract-text',
});

export default function ExtractTextPage() {
  return (
    <div>
      <h1>Extract Text from PDF and Images</h1>
      <p>Free online OCR tool — extract text from PDF files, images (JPG, PNG), and scanned documents instantly.</p>

      <div>
        <h2>Upload Your File</h2>
        <p>Supported formats: PDF, JPG, PNG, scanned PDFs</p>
        <Link href="/extract-text-from-pdf">Go to OCR Tool</Link>
      </div>

      <div>
        <h2>Related Tools</h2>
        <ul>
          <li><Link href="/pdf-to-text">PDF to Text</Link></li>
          <li><Link href="/image-to-text">Image to Text</Link></li>
          <li><Link href="/jpg-to-text">JPG to Text</Link></li>
          <li><Link href="/png-to-text">PNG to Text</Link></li>
          <li><Link href="/scanned-pdf-to-text">Scanned PDF to Text</Link></li>
        </ul>
      </div>

      <div>
        <h2>How It Works</h2>
        <ol>
          <li>Upload your PDF or image file</li>
          <li>Our AI analyzes the document</li>
          <li>Extracted text appears instantly</li>
          <li>Copy or download the text</li>
        </ol>
      </div>
    </div>
  );
}