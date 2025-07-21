import { neon } from '@neondatabase/serverless';

import { env } from '@/lib/env';

const sql = neon(env.DATABASE_URL!);

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  cover_image: string | null;
  author_name: string;
  author_avatar: string | null;
  created_at: string;
  updated_at: string;
  published: boolean;
  is_featured: boolean;
  is_pinned: boolean;
  view_count?: number;
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    if (!env.DATABASE_URL) {
      console.warn('DATABASE_URL not found, returning empty posts array');
      return [];
    }

    const posts = await sql`
      SELECT
        id, title, content, excerpt, slug, cover_image,
        author_name, author_avatar, created_at, updated_at,
        published, is_featured, is_pinned, view_count
      FROM posts
      WHERE published = true
      ORDER BY is_pinned DESC, created_at DESC
    `;

    return posts as Post[];
  } catch (error) {
    console.error('获取所有文章错误:', error);
    return [];
  }
}

export async function getFeaturedPost(): Promise<Post | null> {
  try {
    if (!env.DATABASE_URL) {
      return null;
    }

    const posts = await sql`
      SELECT
        id, title, content, excerpt, slug, cover_image,
        author_name, author_avatar, created_at, updated_at,
        published, is_featured, is_pinned, view_count
      FROM posts
      WHERE published = true AND is_featured = true
      ORDER BY created_at DESC
      LIMIT 1
    `;

    return (posts[0] as Post) || null;
  } catch (error) {
    console.error('获取精选文章错误:', error);
    return null;
  }
}

export async function getRecentPosts(limit = 5): Promise<Post[]> {
  try {
    if (!env.DATABASE_URL) {
      return [];
    }

    const posts = await sql`
      SELECT
        id, title, content, excerpt, slug, cover_image,
        author_name, author_avatar, created_at, updated_at,
        published, is_featured, is_pinned, view_count
      FROM posts
      WHERE published = true
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return posts as Post[];
  } catch (error) {
    console.error('获取最新文章错误:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    if (!env.DATABASE_URL) {
      return null;
    }

    const posts = await sql`
      SELECT
        id, title, content, excerpt, slug, cover_image,
        author_name, author_avatar, created_at, updated_at,
        published, is_featured, is_pinned, view_count
      FROM posts
      WHERE slug = ${slug} AND published = true
    `;

    return (posts[0] as Post) || null;
  } catch (error) {
    console.error('根据slug获取文章错误:', error);
    return null;
  }
}

export async function getPostById(id: number): Promise<Post | null> {
  try {
    if (!env.DATABASE_URL) {
      return null;
    }

    const posts = await sql`
      SELECT
        id, title, content, excerpt, slug, cover_image,
        author_name, author_avatar, created_at, updated_at,
        published, is_featured, is_pinned, view_count
      FROM posts
      WHERE id = ${id}
    `;

    return (posts[0] as Post) || null;
  } catch (error) {
    console.error('根据ID获取文章错误:', error);
    return null;
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractExcerpt(content: string, maxLength = 150): string {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/[#*`]/g, '');
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
}

export function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]$$([^)]*)$$/gim, '<img alt="$1" src="$2" />')
    .replace(/\[([^\]]*)\]$$([^)]*)$$/gim, '<a href="$2">$1</a>')
    .replace(/\n/gim, '<br>');
}

export async function getPosts(limit?: number): Promise<Post[]> {
  return typeof limit === 'number' ? getRecentPosts(limit) : getAllPosts();
}
