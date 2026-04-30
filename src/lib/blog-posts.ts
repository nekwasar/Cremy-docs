import { getMongoDb } from '@/lib/mongodb';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function createBlogPost(data: {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: 'draft' | 'published' | 'scheduled';
  scheduledAt?: Date;
}): Promise<BlogPost | null> {
  const db = await getMongoDb();

  const existing = await db.collection('blog_posts').findOne({ slug: data.slug });
  if (existing) return null;

  const now = new Date();
  const post = {
    slug: data.slug,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    status: data.status || 'draft',
    publishedAt: data.status === 'published' ? now : undefined,
    scheduledAt: data.scheduledAt,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection('blog_posts').insertOne(post);
  return { id: result.insertedId.toString(), ...post };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const db = await getMongoDb();
  const posts = await db.collection('blog_posts')
    .find({ status: 'published', publishedAt: { $lte: new Date() } })
    .sort({ publishedAt: -1 })
    .toArray();

  return posts.map(toPost);
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const db = await getMongoDb();
  const posts = await db.collection('blog_posts')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return posts.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = await getMongoDb();
  const post = await db.collection('blog_posts').findOne({ slug });
  if (!post) return null;
  return toPost(post);
}

export async function updateBlogPost(
  id: string,
  data: Partial<{
    title: string;
    content: string;
    excerpt: string;
    seoTitle: string;
    seoDescription: string;
    status: 'draft' | 'published' | 'scheduled';
    scheduledAt: Date;
  }>
): Promise<boolean> {
  const db = await getMongoDb();
  const update: Record<string, any> = { ...data, updatedAt: new Date() };
  if (data.status === 'published' && !data.publishedAt) {
    update.publishedAt = new Date();
  }
  const result = await db.collection('blog_posts').updateOne(
    { _id: id },
    { $set: update }
  );
  return result.modifiedCount > 0;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const db = await getMongoDb();
  const result = await db.collection('blog_posts').deleteOne({ _id: id });
  return result.deletedCount > 0;
}

function toPost(doc: any): BlogPost {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    content: doc.content,
    excerpt: doc.excerpt,
    seoTitle: doc.seoTitle,
    seoDescription: doc.seoDescription,
    status: doc.status,
    publishedAt: doc.publishedAt,
    scheduledAt: doc.scheduledAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
