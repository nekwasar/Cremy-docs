import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Change Document Style Online — Reformat Documents Free',
  description: 'Change the style of any document. Apply professional formatting to DOCX, PDF, and more. Free online document styling tool.',
  path: '/change-document-style',
});

export default function ChangeDocumentStylePage() {
  return (
    <div>
      <h1>Change Document Style Online</h1>
      <p>Transform the look of any document. Apply professional styles to DOCX, PDF, and text documents.</p>

      <Link href="/change-style">Change Document Style Now</Link>

      <div>
        <h2>What You Can Change</h2>
        <ul>
          <li>Font styles and sizes</li>
          <li>Color schemes and themes</li>
          <li>Page layout and margins</li>
          <li>Heading hierarchy and structure</li>
          <li>Overall document formatting</li>
        </ul>
      </div>

      <div>
        <h2>Related Tools</h2>
        <ul>
          <li><Link href="/change-style">Change Style</Link></li>
          <li><Link href="/change-pdf-style">Change PDF Style</Link></li>
        </ul>
      </div>
    </div>
  );
}