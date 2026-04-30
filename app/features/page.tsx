import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

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
    <div>
      <h1>All Features</h1>
      <p>Everything you can do with Cremy Docs — all free to use.</p>
      {features.map((feature, i) => (
        <div key={i}>
          <h2>{feature.title}</h2>
          <p>{feature.description}</p>
        </div>
      ))}
      <Link href="/">Start Creating</Link>
    </div>
  );
}