export const SITE_CONFIG = {
  name: 'Cremy Docs',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://cremydocs.com',
  description: 'Create professional documents with AI. Convert, translate, format, and generate documents instantly. Free online document tools.',
  twitter: '@cremydocs',
  locale: 'en_US',
};

export function generatePageMetadata(page: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
}): {
  title: string;
  description: string;
  alternates: { canonical: string };
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: string;
    siteName: string;
    images?: string[];
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images?: string[];
  };
} {
  const fullTitle = `${page.title} | ${SITE_CONFIG.name}`;
  const canonicalUrl = `${SITE_CONFIG.url}${page.path}`;

  return {
    title: fullTitle,
    description: page.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: fullTitle,
      description: page.description,
      url: canonicalUrl,
      type: page.type || 'website',
      siteName: SITE_CONFIG.name,
      ...(page.image ? { images: [page.image] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: page.description,
      ...(page.image ? { images: [page.image] } : {}),
    },
  };
}

export const PUBLIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/features', priority: 0.8, changefreq: 'monthly' },
  { path: '/how-it-works', priority: 0.8, changefreq: 'monthly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
  { path: '/privacy', priority: 0.5, changefreq: 'yearly' },
  { path: '/terms', priority: 0.5, changefreq: 'yearly' },
  { path: '/pro', priority: 0.9, changefreq: 'weekly' },
  { path: '/templates', priority: 0.8, changefreq: 'weekly' },
  { path: '/convert', priority: 0.9, changefreq: 'daily' },
  { path: '/format', priority: 0.8, changefreq: 'weekly' },
] as const;
