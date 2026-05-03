import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export const metadata = generatePageMetadata({
  title: 'Features',
  description: 'Explore all Cremy Docs features including AI document generation, file conversion, translation, voice-to-document, OCR, PDF tools, and more. Free online document tools.',
  path: '/features',
});

export default function FeaturesPage() {
  const features = [
    { title: 'AI Document Generation', description: 'Create professional documents from text descriptions. Choose from 18+ formats including invoices, contracts, essays, resumes, and more.' },
    { title: 'File Conversion', description: 'Convert between 200+ format pairs for free. PDF, DOCX, images, spreadsheets, presentations, ebooks — all supported.' },
    { title: 'Translation', description: 'Translate documents between 10 major languages while preserving formatting and layout.' },
    { title: 'Voice to Document', description: 'Record your voice and get a formatted document. AI removes filler words and structures the content.' },
    { title: 'OCR Text Extraction', description: 'Extract text from PDFs and images with AI-powered accuracy.' },
    { title: 'PDF Tools', description: 'Merge, split, and compress PDF files. All free, no registration needed.' },
    { title: 'Document Editing', description: 'Edit documents inline or use AI commands to modify content. Undo history keeps your work safe.' },
    { title: 'Templates', description: 'Pre-built templates for business, academic, legal, personal, and creative documents.' },
  ];

  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>All Features</h1>
      <p style={{marginBottom:'var(--space-6)',color:'var(--color-text-muted)'}}>Everything you can do with Cremy Docs — all free to use.</p>

      <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)',marginBottom:'var(--space-8)'}}>
        {features.map((feature, i) => (
          <div key={i} className={`${c.card} ${c.soft}`}>
            <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-2)'}}>{feature.title}</h2>
            <p style={{color:'var(--color-text-muted)'}}>{feature.description}</p>
          </div>
        ))}
      </div>

      <Link href="/" className={`${b.btn} ${b.soft}`}>Start Creating</Link>
    </div>
  );
}
