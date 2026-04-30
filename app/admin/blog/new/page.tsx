'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBlogStore } from '@/store/blog-store';
import { createBlogPost } from '@/lib/blog-posts';
import { AdminSidebar } from '../../../_components/AdminSidebar';

export default function AdminBlogNewPage() {
  const router = useRouter();
  const {
    slug, title, content, excerpt, seoTitle, seoDescription, status, scheduledAt,
    setSlug, setTitle, setContent, setExcerpt, setSeoTitle, setSeoDescription, setStatus, setScheduledAt, reset,
  } = useBlogStore();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setContent(ev.target?.result as string);
    reader.readAsText(file);
    if (!title) {
      const name = file.name.replace(/\.[^.]+$/, '');
      setTitle(name);
      setSlug(name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handlePublish = async () => {
    if (!slug.trim() || !title.trim() || !content.trim()) {
      setError('Slug, title, and content are required');
      return;
    }

    setLoading(true);
    const result = await createBlogPost({
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title: title.trim(),
      content,
      excerpt: excerpt.trim() || title.trim(),
      seoTitle: seoTitle.trim() || title.trim(),
      seoDescription: seoDescription.trim() || excerpt.trim(),
      status,
      scheduledAt: status === 'scheduled' ? scheduledAt : undefined,
    });

    if (result) {
      reset();
      router.push('/admin/blog');
    } else {
      setError('A post with this slug already exists');
    }
    setLoading(false);
  };

  const handlePreview = () => {
    setError('');
    setLoading(true);
    const encodedContent = encodeURIComponent(content);
    window.open(`/preview-blog?content=${encodedContent}&title=${encodeURIComponent(title)}`, '_blank');
    setLoading(false);
  };

  return (
    <div>
      <AdminSidebar />
      <div>
        <h1>Create Blog Post</h1>

        {error && <p>{error}</p>}

        <div>
          <h2>Upload or Paste Content</h2>
          <div>
            <p>Upload .md, .html, or .ejs file:</p>
            <input type="file" accept=".md,.html,.ejs,.txt" onChange={handleFileUpload} />
          </div>
          <div>
            <p>Or paste content:</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste markdown or HTML content here..."
              rows={10}
            />
          </div>
        </div>

        <div>
          <h2>Post Details</h2>
          <div>
            <label>Slug (URL path): /blog/<input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="my-post-slug" /></label>
          </div>
          <div>
            <label>Title: <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" /></label>
          </div>
          <div>
            <label>Excerpt: <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief description" rows={2} /></label>
          </div>
        </div>

        <div>
          <h2>SEO Metadata</h2>
          <div>
            <label>SEO Title: <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Leave empty to use post title" /></label>
          </div>
          <div>
            <label>SEO Description: <input value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Leave empty to use excerpt" /></label>
          </div>
        </div>

        <div>
          <h2>Publishing</h2>
          <div>
            <label>
              <input type="radio" name="status" checked={status === 'draft'} onChange={() => setStatus('draft')} />
              Save as Draft
            </label>
            <label>
              <input type="radio" name="status" checked={status === 'published'} onChange={() => setStatus('published')} />
              Publish Now
            </label>
            <label>
              <input type="radio" name="status" checked={status === 'scheduled'} onChange={() => setStatus('scheduled')} />
              Schedule
            </label>
          </div>
          {status === 'scheduled' && (
            <div>
              <label>Publish date: <input type="datetime-local" onChange={(e) => setScheduledAt(e.target.value ? new Date(e.target.value) : null)} /></label>
            </div>
          )}
        </div>

        <div>
          <button onClick={handlePreview}>Preview</button>
          <button onClick={handlePublish} disabled={loading}>
            {loading ? 'Publishing...' : status === 'published' ? 'Publish' : status === 'scheduled' ? 'Schedule' : 'Save Draft'}
          </button>
        </div>
      </div>
    </div>
  );
}