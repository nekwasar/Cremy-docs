import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generate Document',
  description: 'Create professional documents with AI',
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}