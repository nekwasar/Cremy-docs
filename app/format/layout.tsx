import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Document Formats',
  description: 'Choose from professional document formats including business, academic, legal, personal, and creative templates.',
};

export default function FormatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}