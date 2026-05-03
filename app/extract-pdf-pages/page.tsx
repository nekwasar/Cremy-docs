import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Extract PDF Pages Online — Separate PDF Pages Free',
  description: 'Extract specific pages from PDF documents. Separate PDF pages into individual files. Free online tool, no registration needed.',
  path: '/extract-pdf-pages',
});

export default function ExtractPdfPagesPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>Extract PDF Pages Online</h1>
      <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
        <p>Extract specific pages from any PDF document. Separate individual pages or page ranges into separate files instantly. Free online, no registration needed.</p>
        <Link href="/split-pdf" className={`${b.btn} ${b.soft}`}>Extract PDF Pages Now</Link>
      </div>
    </div>
  );
}
