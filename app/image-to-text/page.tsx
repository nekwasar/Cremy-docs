import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Image to Text Converter — Extract Text from Images Free',
  description: 'Convert images to editable text. Extract text from JPG, PNG, and other images with our free online OCR tool. No registration, no watermarks.',
  path: '/image-to-text',
});

export default function ImageToTextPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>Image to Text Converter</h1>
      <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
        <p>Extract text from any image — JPG, PNG, WEBP, and more. Free online OCR with no registration and no watermarks.</p>
        <Link href="/extract-text-from-pdf" className={`${b.btn} ${b.soft}`}>Extract Text from Image Now</Link>
      </div>
    </div>
  );
}
