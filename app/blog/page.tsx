import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Blog',
  description: 'Tips, guides, and insights about document creation, file conversion, AI tools, and productivity.',
  path: '/blog',
});

export default function BlogPage() {
  const posts = [
    { slug: 'ai-document-generation-guide', title: 'Complete Guide to AI Document Generation in 2026', date: '2026-04-01', excerpt: 'Learn how AI is transforming document creation and how you can use it to save hours of work.' },
    { slug: 'convert-pdf-to-word-free', title: 'How to Convert PDF to Word for Free (Without Losing Formatting)', date: '2026-03-15', excerpt: 'Step-by-step guide to converting PDF files to editable Word documents while preserving layout.' },
    { slug: 'best-document-formats', title: 'Choosing the Right Document Format: PDF vs DOCX vs Markdown', date: '2026-03-01', excerpt: 'Understand the strengths and use cases of different document formats to make the right choice.' },
  ];

  return (
    <div>
      <h1>Blog</h1>
      <p>Tips, guides, and insights about documents, AI, and productivity.</p>
      {posts.map((post) => (
        <div key={post.slug}>
          <Link href={`/blog/${post.slug}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
}