import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ formatId: string }>;
}): Promise<Metadata> {
  const { formatId } = await params;
  const { getFormatById } = await import('@/config/formats');
  const format = getFormatById(formatId);

  if (!format) {
    return { title: 'Format Not Found' };
  }

  return {
    title: `${format.name} - AI Document Generator`,
    description: `Generate professional ${format.name.toLowerCase()} documents with AI. ${format.description}`,
    openGraph: {
      title: `Create ${format.name} Documents`,
      description: format.description,
    },
  };
}

export default function FormatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}