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
    <div className="home-page">
      <section className="hero">
        <h1>AI-Powered Document Platform</h1>
        <p>Generate, convert, and edit documents with AI</p>
        <div className="hero-actions">
          <Link href="/generate" className="btn-primary">Start Generating</Link>
          <Link href="/templates" className="btn-secondary">Browse Templates</Link>
        </div>
      </section>

      <section className="tools-section">
        <h2>All Tools</h2>
        <div className="tools-grid">
          {tools.map((tool) => (
            <Link key={tool.path} href={tool.path} className="tool-card">
              <h3>{tool.name}</h3>
              <p>{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <ul>
          <li>AI-powered document generation</li>
          <li>PDF conversion and manipulation</li>
          <li>Multi-language translation</li>
          <li>Voice to document</li>
          <li>Automatic credit rewards</li>
        </ul>
      </section>

      <section className="cta">
        <h2>Get Started Free</h2>
        <p>Sign up for free credits and start creating documents</p>
        <Link href="/auth/register" className="btn-primary">Create Account</Link>
      </section>
    </div>
  );
}