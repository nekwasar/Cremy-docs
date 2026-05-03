import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'JPG to Text Converter — Extract Text from JPG Free',
  description: 'Convert JPG images to editable text. Free online OCR for JPG photos and scanned documents. No registration, instant results.',
  path: '/jpg-to-text',
});

export default function JpgToTextPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>JPG to Text Converter</h1>
      <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
        <p>Convert JPG images to editable text instantly. Free online OCR for photos and scanned documents — no registration, instant results.</p>
        <Link href="/extract-text-from-pdf" className={`${b.btn} ${b.soft}`}>Convert JPG to Text Now</Link>
      </div>
    </div>
  );
}
