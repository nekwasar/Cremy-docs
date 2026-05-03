import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Extract Text from PDF and Images — Free Online OCR',
  description: 'Extract text from PDF, images, and scanned documents instantly. Free online OCR tool. No registration needed. Supports JPG, PNG, PDF, and scanned PDFs.',
  path: '/extract-text',
});

export default function ExtractTextPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>Extract Text from PDF and Images</h1>
      <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
        <p>Free online OCR tool — extract text from PDF files, images (JPG, PNG), and scanned documents instantly. No registration needed.</p>
        <Link href="/extract-text-from-pdf" className={`${b.btn} ${b.soft}`}>Go to OCR Tool</Link>
      </div>
    </div>
  );
}
