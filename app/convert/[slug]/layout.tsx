import { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { getPairBySlug } = await import('@/config/convert-pairs');
  const pair = getPairBySlug(slug);

  if (!pair) {
    return {
      title: 'Conversion Not Found | Cremy Docs',
      description: 'The requested conversion is not available.',
    };
  }

  const canonicalUrl = `https://cremydocs.com/convert/${slug}`;

  return {
    title: pair.seoTitle,
    description: pair.seoDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: pair.seoTitle,
      description: pair.seoDescription,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Cremy Docs',
    },
    twitter: {
      card: 'summary_large_image',
      title: pair.seoTitle,
      description: pair.seoDescription,
    },
  };
}

export async function generateStaticParams() {
  const { CONVERT_PAIRS } = await import('@/config/convert-pairs');
  return CONVERT_PAIRS.map((pair) => ({ slug: pair.slug }));
}

export default function ConvertSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}