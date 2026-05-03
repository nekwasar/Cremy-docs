import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Change PDF Style Online — Reformat PDF Free',
  description: 'Change the style and formatting of your PDF documents. Apply professional templates and styles to PDFs for free online.',
  path: '/change-pdf-style',
});

export default function ChangePdfStylePage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>Change PDF Style Online</h1>
      <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
        <p>Apply professional styles and formatting to your PDF documents. Change fonts, colors, layout, and more with our free online PDF styling tool.</p>
        <Link href="/change-style" className={`${b.btn} ${b.soft}`}>Change PDF Style Now</Link>
      </div>
    </div>
  );
}
