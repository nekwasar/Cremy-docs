import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Document Preview',
  description: 'Preview and edit your document',
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}