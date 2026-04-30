import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

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
    <div>
      <h1>How It Works</h1>
      <p>Create professional documents in 4 simple steps.</p>
      {steps.map((step) => (
        <div key={step.step}>
          <h2>Step {step.step}: {step.title}</h2>
          <p>{step.description}</p>
        </div>
      ))}
      <Link href="/generate">Try It Now</Link>
    </div>
  );
}