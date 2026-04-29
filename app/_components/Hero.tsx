import Link from 'next/link';

interface Props {
  title?: string;
  subtitle?: string;
}

export function Hero({ title = 'AI-Powered Document Platform', subtitle = 'Generate, convert, and edit documents with AI' }: Props) {
  return (
    <section>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div>
        <Link href="/generate">Start Generating</Link>
        <Link href="/templates">Browse Templates</Link>
      </div>
    </section>
  );
}