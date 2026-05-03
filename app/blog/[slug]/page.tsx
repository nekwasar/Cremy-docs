import { getPostBySlug } from '@/lib/blog-posts';
import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: 'Post Not Found' };

  return generatePageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${slug}`,
    type: 'article',
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <article>
        <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>{post.title}</h1>
        <p style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)',marginBottom:'var(--space-6)'}}>Published on {new Date(post.publishedAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}} dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      <Link href="/blog" className={`${b.btn} ${b.soft}`}>← Back to Blog</Link>
    </div>
  );
}
