import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Change PDF Style Online — Reformat PDF Free',
  description: 'Change the style and formatting of your PDF documents. Apply professional templates and styles to PDFs for free online.',
  path: '/change-pdf-style',
});

export default function ChangePdfStylePage() {
  return (
    <div>
      <h1>Change PDF Style Online</h1>
      <p>Apply professional styles and formatting to your PDF documents. Change fonts, colors, layout, and more.</p>

      <Link href="/change-style">Change PDF Style Now</Link>

      <div>
        <h2>Available Styles</h2>
        <ul>
          <li>Professional — clean business formatting</li>
          <li>Academic — scholarly paper formatting</li>
          <li>Creative — expressive and modern styles</li>
          <li>Legal — formal legal document formatting</li>
        </ul>
      </div>

      <div>
        <h2>Related Tools</h2>
        <ul>
          <li><Link href="/change-style">Change Document Style</Link></li>
          <li><Link href="/change-document-style">Change Document Style</Link></li>
        </ul>
      </div>
    </div>
  );
}