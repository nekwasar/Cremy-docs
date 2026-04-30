import { getPostBySlug } from '@/lib/blog-posts';
import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    <div>
      <article>
        <h1>{post.title}</h1>
        <p>Published on {new Date(post.publishedAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      <Link href="/blog">← Back to Blog</Link>
    </div>
  );
}