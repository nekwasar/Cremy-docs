import { generatePageMetadata } from '@/config/seo';
import c from '@/styles/components/Card.module.css';

export const metadata = generatePageMetadata({
  title: 'About',
  description: 'Cremy Docs is an AI-powered document platform that helps you create, convert, translate, and manage documents effortlessly. Built for professionals and teams.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>About Cremy Docs</h1>
      <div className={`${c.card} ${c.soft}`}>
        <p>Cremy Docs is an AI-powered document platform built to make document creation, conversion, and management effortless.</p>
        <p style={{marginTop:'var(--space-4)'}}>Our mission is to provide professional-grade document tools that are accessible to everyone — free to use, no registration required for basic features, and powerful AI-enhanced capabilities for those who need more.</p>
        <p style={{marginTop:'var(--space-4)'}}>We support 25+ file formats, 10 languages for translation, voice-to-document conversion, and AI-powered editing — all in one place.</p>
      </div>
    </div>
  );
}
