import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Reduce PDF File Size Online — Compress PDF Free',
  description: 'Reduce PDF file size without losing quality. Compress PDF files online for free. Make PDFs smaller for email, upload, and storage.',
  path: '/reduce-pdf-size',
});

export default function ReducePdfSizePage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>Reduce PDF File Size Online</h1>
      <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
        <p>Compress and reduce PDF file size without losing quality. Make your PDFs smaller for email, upload, and storage.</p>
        <Link href="/compress-pdf" className={`${b.btn} ${b.soft}`}>Reduce PDF Size Now</Link>
      </div>
    </div>
  );
}
