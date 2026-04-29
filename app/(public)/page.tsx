import Link from 'next/link';

export default function HomePage() {
  const tools = [
    { name: 'Generate', path: '/generate', desc: 'AI document generation' },
    { name: 'Convert', path: '/convert', desc: 'Convert between formats' },
    { name: 'Translate', path: '/translate', desc: 'Translate documents' },
    { name: 'Voice', path: '/voice', desc: 'Voice to document' },
    { name: 'Extract Text', path: '/extract-text-from-pdf', desc: 'OCR text extraction' },
    { name: 'Merge PDF', path: '/merge-pdf', desc: 'Merge PDF files' },
    { name: 'Split PDF', path: '/split-pdf', desc: 'Split PDF files' },
    { name: 'Compress', path: '/compress-pdf', desc: 'Compress PDF files' },
    { name: 'Change Style', path: '/change-style', desc: 'Change document style' },
  ];

  return (
    <div>
      <section>
        <h1>AI-Powered Document Platform</h1>
        <p>Generate, convert, and edit documents with AI</p>
        <div>
          <Link href="/generate">Start Generating</Link>
          <Link href="/templates">Browse Templates</Link>
        </div>
      </section>

      <section>
        <h2>All Tools</h2>
        <div>
          {tools.map((tool) => (
            <Link key={tool.path} href={tool.path}>
              <h3>{tool.name}</h3>
              <p>{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Features</h2>
        <ul>
          <li>AI-powered document generation</li>
          <li>PDF conversion and manipulation</li>
          <li>Multi-language translation</li>
          <li>Voice to document</li>
          <li>Automatic credit rewards</li>
        </ul>
      </section>

      <section>
        <h2>Get Started Free</h2>
        <p>Sign up for free credits and start creating documents</p>
        <Link href="/auth/register">Create Account</Link>
      </section>
    </div>
  );
}