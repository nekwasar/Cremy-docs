import { FORMATS } from '@/config/formats';

export function generateFormatMetadata(formatId: string) {
  const format = FORMATS.find((f) => f.id === formatId);
  if (!format) return null;

  return {
    title: `${format.name} — AI Document Generator | Cremy Docs`,
    description: `Create professional ${format.name.toLowerCase()} documents with AI. Free online. ${format.description}`,
    openGraph: {
      title: `Create ${format.name} Documents`,
      description: format.description,
    },
  };
}
