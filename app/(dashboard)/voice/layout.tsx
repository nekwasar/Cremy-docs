import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voice to Document',
  description: 'Convert voice recordings into professional documents',
};

export default function VoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}