import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cremy Docs - AI-Powered Document Platform',
  description: 'Generate, convert, and edit documents with AI. Free credits available.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}