import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'PNG to Text Converter — Extract Text from PNG Free',
  description: 'Convert PNG images to editable text. Free OCR for PNG screenshots and graphics. No registration needed. Instant text extraction.',
  path: '/png-to-text',
});

export default function PngToTextPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>PNG to Text Converter</h1>
      <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
        <p>Extract text from PNG images, screenshots, and graphics with our free online OCR tool.</p>
        <Link href="/extract-text-from-pdf" className={`${b.btn} ${b.soft}`}>Convert PNG to Text Now</Link>
      </div>
    </div>
  );
}
