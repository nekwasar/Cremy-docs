import type { Metadata } from 'next';

/**
 * Global Metadata for Cremy Docs
 */
export const metadata: Metadata = {
  title: 'Cremy Docs - AI-Powered Document Platform',
  description: 'Documents, done smoothly. Generate, convert, translate, and more.',
  keywords: ['document', 'AI', 'PDF', 'converter', 'editor'],
  authors: [{ name: 'Cremy Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

/**
 * Root Layout
 * 
 * This is the main layout that wraps all pages.
 * Currently minimal - will be expanded with the full UI.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}