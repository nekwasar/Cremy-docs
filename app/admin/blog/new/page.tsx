'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBlogStore } from '@/store/blog-store';
import { createBlogPost } from '@/lib/blog-posts';
import { AdminSidebar } from '../../../_components/AdminSidebar';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';

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
      scheduledAt: status === 'scheduled' ? (scheduledAt || undefined) : undefined,
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
    <div style={{display:'flex'}}>
      <AdminSidebar />
      <div style={{maxWidth:'var(--container-xl)',margin:'0 auto',padding:'var(--space-8) var(--space-6)',flex:1}}>
        <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',marginBottom:'var(--space-6)'}}>Create Blog Post</h1>

        {error && <p style={{color:'var(--color-error)',marginBottom:'var(--space-4)',fontSize:'var(--text-sm)'}}>{error}</p>}

        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Upload or Paste Content</h2>
          <div style={{marginBottom:'var(--space-4)'}}>
            <p style={{fontSize:'var(--text-sm)',marginBottom:'var(--space-2)'}}>Upload .md, .html, or .ejs file:</p>
            <input type="file" accept=".md,.html,.ejs,.txt" onChange={handleFileUpload} />
          </div>
          <div>
            <p style={{fontSize:'var(--text-sm)',marginBottom:'var(--space-2)'}}>Or paste content:</p>
            <textarea
              className={`${i.input} ${i.soft} ${i.textarea}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste markdown or HTML content here..."
              rows={10}
            />
          </div>
        </div>

        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Post Details</h2>
          <div className={i.group}>
            <label className={i.label}>Slug (URL path)</label>
            <input className={`${i.input} ${i.soft}`} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="my-post-slug" />
          </div>
          <div className={i.group}>
            <label className={i.label}>Title</label>
            <input className={`${i.input} ${i.soft}`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
          </div>
          <div className={i.group}>
            <label className={i.label}>Excerpt</label>
            <textarea className={`${i.input} ${i.soft} ${i.textarea}`} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief description" rows={2} />
          </div>
        </div>

        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>SEO Metadata</h2>
          <div className={i.group}>
            <label className={i.label}>SEO Title</label>
            <input className={`${i.input} ${i.soft}`} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Leave empty to use post title" />
          </div>
          <div className={i.group}>
            <label className={i.label}>SEO Description</label>
            <input className={`${i.input} ${i.soft}`} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Leave empty to use excerpt" />
          </div>
        </div>

        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Publishing</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)',marginBottom:'var(--space-4)'}}>
            {[
              { value: 'draft', label: 'Save as Draft' },
              { value: 'published', label: 'Publish Now' },
              { value: 'scheduled', label: 'Schedule' },
            ].map((opt) => (
              <label key={opt.value} style={{display:'flex',alignItems:'center',gap:'var(--space-2)',cursor:'pointer'}}>
                <input type="radio" name="status" checked={status === opt.value} onChange={() => setStatus(opt.value as any)} />
                <span style={{fontSize:'var(--text-sm)'}}>{opt.label}</span>
              </label>
            ))}
          </div>
          {status === 'scheduled' && (
            <div className={i.group}>
              <label className={i.label}>Publish date</label>
              <input className={`${i.input} ${i.soft}`} type="datetime-local" onChange={(e) => setScheduledAt(e.target.value ? new Date(e.target.value) : null)} />
            </div>
          )}
        </div>

        <div style={{display:'flex',gap:'var(--space-3)'}}>
          <button className={`${b.btn} ${b.raw}`} onClick={handlePreview}>Preview</button>
          <button className={`${b.btn} ${b.soft}`} onClick={handlePublish} disabled={loading}>
            {status === 'published' ? 'Publish' : status === 'scheduled' ? 'Schedule' : 'Save Draft'}
          </button>
        </div>
      </div>
    </div>
  );
}
