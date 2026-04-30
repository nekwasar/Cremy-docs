import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generatePageMetadata({
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Read our article about ${slug.replace(/-/g, ' ')}. Tips, guides, and insights from Cremy Docs.`,
    path: `/blog/${slug}`,
    type: 'article',
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div>
      <article>
        <h1>{title}</h1>
        <p>Published on {new Date().toLocaleDateString()}</p>
        <div>
          <p>This is a placeholder article about {slug.replace(/-/g, ' ')}. Full content coming soon.</p>
        </div>
      </article>
      <Link href="/blog">← Back to Blog</Link>
    </div>
  );
}