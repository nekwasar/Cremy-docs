import { generatePageMetadata } from '@/config/seo';

export const metadata = generatePageMetadata({
  title: 'About',
  description: 'Cremy Docs is an AI-powered document platform that helps you create, convert, translate, and manage documents effortlessly. Built for professionals and teams.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div>
      <h1>About Cremy Docs</h1>
      <p>Cremy Docs is an AI-powered document platform built to make document creation, conversion, and management effortless.</p>
      <p>Our mission is to provide professional-grade document tools that are accessible to everyone — free to use, no registration required for basic features, and powerful AI-enhanced capabilities for those who need more.</p>
      <p>We support 25+ file formats, 10 languages for translation, voice-to-document conversion, and AI-powered editing — all in one place.</p>
    </div>
  );
}