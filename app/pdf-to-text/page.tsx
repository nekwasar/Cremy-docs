import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'PDF to Text Converter — Extract Text from PDF Free',
  description: 'Convert PDF to text instantly. Extract text from any PDF document with our free online tool. Preserves formatting and structure. No registration needed.',
  path: '/pdf-to-text',
});

export default function PdfToTextPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>PDF to Text Converter</h1>
      <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
        <p>Extract text from any PDF document instantly. Free, fast, and preserves document structure.</p>
        <Link href="/extract-text-from-pdf" className={`${b.btn} ${b.soft}`}>Convert PDF to Text Now</Link>
      </div>
    </div>
  );
}
