import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Image to Text Converter — Extract Text from Images Free',
  description: 'Convert images to editable text. Extract text from JPG, PNG, and other images with our free online OCR tool. No registration, no watermarks.',
  path: '/image-to-text',
});

export default function ImageToTextPage() {
  return (
    <div>
      <h1>Image to Text Converter</h1>
      <p>Extract text from any image — JPG, PNG, WEBP, and more. Free online OCR.</p>

      <Link href="/extract-text-from-pdf">Extract Text from Image Now</Link>

      <div>
        <h2>Supported Image Formats</h2>
        <ul>
          <li>JPG / JPEG — photos and scanned documents</li>
          <li>PNG — screenshots and graphics</li>
          <li>WEBP — modern web images</li>
        </ul>
      </div>

      <div>
        <h2>Related Tools</h2>
        <ul>
          <li><Link href="/jpg-to-text">JPG to Text</Link></li>
          <li><Link href="/png-to-text">PNG to Text</Link></li>
          <li><Link href="/pdf-to-text">PDF to Text</Link></li>
        </ul>
      </div>
    </div>
  );
}