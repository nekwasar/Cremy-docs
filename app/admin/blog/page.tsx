'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPosts, deleteBlogPost, updateBlogPost, BlogPost } from '@/lib/blog-posts';
import { AdminSidebar } from '../../_components/AdminSidebar';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import t from '@/styles/components/Table.module.css';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    setLoading(true);
    const all = await getAllPosts();
    setPosts(all);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    await deleteBlogPost(id);
    loadPosts();
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await updateBlogPost(post.id, { status: newStatus as 'draft' | 'published' });
    loadPosts();
  };

  return (
    <div style={{display:'flex'}}>
      <AdminSidebar />
      <div style={{maxWidth:'var(--container-xl)',margin:'0 auto',padding:'var(--space-8) var(--space-6)',flex:1}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-6)'}}>
          <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',margin:0}}>Blog Posts</h1>
          <Link href="/admin/blog/new">
            <button className={`${b.btn} ${b.soft}`}>Create New Post</button>
          </Link>
        </div>

        {!loading && posts.length === 0 ? (
          <div className={`${c.card} ${c.soft}`}>
            <p style={{fontSize:'var(--text-base)',color:'var(--color-text-secondary)'}}>No blog posts yet.</p>
          </div>
        ) : !loading ? (
          <div className={`${c.card} ${c.soft}`}>
            <table className={`${t.table} ${t.soft}`}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td style={{fontWeight:'var(--weight-medium)'}}>{post.title}</td>
                    <td style={{fontFamily:'var(--font-mono)',fontSize:'var(--text-xs)'}}>/{post.slug}</td>
                    <td>{post.status}</td>
                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{display:'flex',gap:'var(--space-2)'}}>
                        <button className={`${b.btn} ${b.minimal}`} onClick={() => handleTogglePublish(post)}>
                          {post.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button className={`${b.btn} ${b.minimal}`} onClick={() => handleDelete(post.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
