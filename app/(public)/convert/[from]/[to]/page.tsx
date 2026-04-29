import { Metadata } from 'next';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: { from: string; to: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const from = params.from.toUpperCase();
  const to = params.to.toUpperCase();
  
  return {
    title: `Convert ${from} to ${to} - Free Online Converter`,
    description: `Convert ${from} files to ${to} format online. Fast, free, and easy to use.`,
  };
}

export default function ConvertFormatPage({ params }: Props) {
  const from = params.from.toUpperCase();
  const to = params.to.toUpperCase();

  return (
    <div className="convert-format-page">
      <h1>Convert {from} to {to}</h1>
      <p>Convert your {from} files to {to} format instantly.</p>

      <Link href={`/convert?from=${from}&to=${to}`} className="btn-convert">
        Start Conversion
      </Link>

      <section className="format-info">
        <h2>About {to} Format</h2>
        <p>{to} is a widely supported document format...</p>
      </section>

      <Link href="/convert" className="back-link">
        ← Back to Convert
      </Link>
    </div>
  );
}