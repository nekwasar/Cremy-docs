import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Cremy Docs',
  description: 'Manage your documents, credits, and settings',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}