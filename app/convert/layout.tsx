import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online File Converter — Convert Documents, Images, Spreadsheets | Cremy Docs',
  description: 'Convert files between 25+ formats for free. Convert PDF, DOCX, images, spreadsheets, presentations, ebooks and more. No registration, no watermarks, no credits needed.',
};

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}