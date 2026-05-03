import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Combine PDF Files Online — Free PDF Combiner',
  description: 'Combine multiple PDF files into one document for free. Merge PDFs online without registration. Fast, secure, and preserves quality.',
  path: '/combine-pdf',
});

export default function CombinePdfPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>Combine PDF Files Online</h1>
      <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
        <p>Combine multiple PDF files into a single document for free. Merge PDFs online without registration — fast, secure, and preserves quality.</p>
        <Link href="/merge-pdf" className={`${b.btn} ${b.soft}`}>Combine PDF Files Now</Link>
      </div>
    </div>
  );
}
