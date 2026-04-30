import { Suspense } from 'react';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${category} Templates`,
    description: `Browse ${category} document templates`,
  };
}

export default function TemplatesCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>;
}