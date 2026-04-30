import { create } from 'zustand';

interface BlogState {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt: Date | null;
  setSlug: (slug: string) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setExcerpt: (excerpt: string) => void;
  setSeoTitle: (title: string) => void;
  setSeoDescription: (desc: string) => void;
  setStatus: (status: 'draft' | 'published' | 'scheduled') => void;
  setScheduledAt: (date: Date | null) => void;
  reset: () => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  slug: '',
  title: '',
  content: '',
  excerpt: '',
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
  scheduledAt: null,
  setSlug: (slug) => set({ slug }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setExcerpt: (excerpt) => set({ excerpt }),
  setSeoTitle: (seoTitle) => set({ seoTitle }),
  setSeoDescription: (seoDescription) => set({ seoDescription }),
  setStatus: (status) => set({ status }),
  setScheduledAt: (scheduledAt) => set({ scheduledAt }),
  reset: () => set({
    slug: '', title: '', content: '', excerpt: '',
    seoTitle: '', seoDescription: '',
    status: 'draft', scheduledAt: null,
  }),
}));