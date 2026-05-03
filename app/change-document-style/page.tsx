import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Change Document Style Online — Reformat Documents Free',
  description: 'Change the style of any document. Apply professional formatting to DOCX, PDF, and more. Free online document styling tool.',
  path: '/change-document-style',
});

export default function ChangeDocumentStylePage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>Change Document Style Online</h1>
      <div className={`${c.card} ${c.soft}`} style={{padding:'var(--space-8)'}}>
        <p>Transform the look of any document instantly. Apply professional styles, fonts, colors, and formatting to DOCX, PDF, and text documents — all online and free.</p>
        <Link href="/change-style" className={`${b.btn} ${b.soft}`}>Change Document Style Now</Link>
      </div>
    </div>
  );
}
