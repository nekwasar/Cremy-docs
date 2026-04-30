import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Cremy Docs',
  description: 'Platform administration',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}