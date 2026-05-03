import { getPublishedPosts } from '@/lib/blog-posts';
import { generatePageMetadata } from '@/config/seo';
import Link from 'next/link';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'Blog',
  description: 'Tips, guides, and insights about document creation, file conversion, AI tools, and productivity.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div style={{maxWidth:'var(--container-md)',margin:'0 auto',padding:'var(--space-8) var(--space-6)'}}>
      <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-4)'}}>Blog</h1>
      <p style={{marginBottom:'var(--space-6)',color:'var(--color-text-muted)'}}>Tips, guides, and insights about documents, AI, and productivity.</p>

      {posts.length === 0 ? (
        <div className={`${c.card} ${c.soft}`}>
          <p>No posts yet. Check back soon.</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
          {posts.map((post) => (
            <div key={post.id} className={`${c.card} ${c.soft}`}>
              <Link href={`/blog/${post.slug}`} style={{textDecoration:'none',color:'inherit'}}>
                <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-2)'}}>{post.title}</h2>
              </Link>
              <p style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)',marginBottom:'var(--space-2)'}}>{new Date(post.publishedAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style={{color:'var(--color-text-muted)'}}>{post.excerpt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
