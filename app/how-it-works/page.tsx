import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export const metadata = generatePageMetadata({
  title: 'How It Works',
  description: 'Learn how Cremy Docs works — upload or describe your document, AI generates or converts it, and you download. Simple, fast, and free.',
  path: '/how-it-works',
});

export default function HowItWorksPage() {
  const steps = [
    { step: 1, title: 'Describe or Upload', description: 'Type what you want or upload your file. Our AI understands natural language descriptions and supports 25+ file formats.' },
    { step: 2, title: 'AI Processes', description: 'Our AI engine analyzes your content, applies the best formatting, and generates your document with high quality.' },
    { step: 3, title: 'Preview & Edit', description: 'Review the result, make edits inline or with AI commands, and ensure everything looks perfect.' },
    { step: 4, title: 'Download', description: 'Download your document in PDF, DOCX, TXT, or HTML format. No watermarks, no registration required.' },
  ];

  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>How It Works</h1>
      <p style={{marginBottom:'var(--space-6)',color:'var(--color-text-muted)'}}>Create professional documents in 4 simple steps.</p>

      <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)',marginBottom:'var(--space-8)'}}>
        {steps.map((step) => (
          <div key={step.step} className={`${c.card} ${c.soft}`}>
            <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-2)'}}>Step {step.step}: {step.title}</h2>
            <p style={{color:'var(--color-text-muted)'}}>{step.description}</p>
          </div>
        ))}
      </div>

      <Link href="/generate" className={`${b.btn} ${b.soft}`}>Try It Now</Link>
    </div>
  );
}
