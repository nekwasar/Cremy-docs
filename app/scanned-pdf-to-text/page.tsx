import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Scanned PDF to Text — OCR for Scanned Documents Free',
  description: 'Convert scanned PDFs to searchable, editable text. Our AI-powered OCR handles handwritten and printed text in scanned documents.',
  path: '/scanned-pdf-to-text',
});

export default function ScannedPdfToTextPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>Scanned PDF to Text Converter</h1>
      <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
        <p>Extract text from scanned PDFs and documents. Our AI-powered OCR handles both printed and handwritten text.</p>
        <Link href="/extract-text-from-pdf" className={`${b.btn} ${b.soft}`}>Convert Scanned PDF to Text Now</Link>
      </div>
    </div>
  );
}
