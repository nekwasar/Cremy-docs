'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPosts, deleteBlogPost, updateBlogPost, BlogPost } from '@/lib/blog-posts';
import { AdminSidebar } from '../../_components/AdminSidebar';

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

    <div>
      <AdminSidebar />
      <div>
        <h1>Blog Posts</h1>
        <Link href="/admin/blog/new">
          <button>Create New Post</button>
        </Link>

        {posts.length === 0 ? (
          <p>No blog posts yet.</p>
        ) : (
          <table>
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
                  <td>{post.title}</td>
                  <td>/{post.slug}</td>
                  <td>{post.status}</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleTogglePublish(post)}>
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => handleDelete(post.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}