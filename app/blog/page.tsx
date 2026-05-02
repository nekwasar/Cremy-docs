import { getPublishedPosts } from '@/lib/blog-posts';
import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'Blog',
  description: 'Tips, guides, and insights about document creation, file conversion, AI tools, and productivity.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div>
      <h1>Blog</h1>
      <p>Tips, guides, and insights about documents, AI, and productivity.</p>
      {posts.length === 0 ? (
        <p>No posts yet. Check back soon.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id}>
            <Link href={`/blog/${post.slug}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>{new Date(post.publishedAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>{post.excerpt}</p>
          </div>
        ))
      )}
    </div>
  );
}