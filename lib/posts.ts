import { neon } from "@neondatabase/serverless"
import { remark } from "remark"
import html from "remark-html"
import stripMarkdown from "strip-markdown"

const sql = neon(process.env.DATABASE_URL!)

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string | null
  published: boolean
  is_featured: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
}

/**
 * 获取所有文章
 */
export async function getPosts(): Promise<Post[]> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Returning empty posts array.")
    return []
  }
  try {
    const posts = await sql<Post[]>`
      SELECT id, title, slug, content, excerpt, cover_image, published, is_featured, is_pinned, created_at, updated_at
      FROM posts
      ORDER BY created_at DESC
    `
    return posts
  } catch (error) {
    console.error("获取文章错误:", error)
    return []
  }
}

/**
 * 获取精选文章
 */
export async function getFeaturedPost(): Promise<Post | null> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Returning null for featured post.")
    return null
  }
  try {
    const [post] = await sql<Post[]>`
      SELECT id, title, slug, content, excerpt, cover_image, published, is_featured, is_pinned, created_at, updated_at
      FROM posts
      WHERE is_featured = TRUE AND published = TRUE
      ORDER BY created_at DESC
      LIMIT 1
    `
    return post ?? null
  } catch (error) {
    console.error("获取精选文章错误:", error)
    return null
  }
}

/**
 * 获取最新文章
 */
export async function getRecentPosts(limit = 5): Promise<Post[]> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Returning empty recent posts array.")
    return []
  }
  try {
    const posts = await sql<Post[]>`
      SELECT id, title, slug, content, excerpt, cover_image, published, is_featured, is_pinned, created_at, updated_at
      FROM posts
      WHERE published = TRUE
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return posts
  } catch (error) {
    console.error("获取最新文章错误:", error)
    return []
  }
}

/**
 * 根据 slug 获取文章
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Returning null for post by slug.")
    return null
  }
  try {
    const [post] = await sql<Post[]>`
      SELECT id, title, slug, content, excerpt, cover_image, published, is_featured, is_pinned, created_at, updated_at
      FROM posts
      WHERE slug = ${slug}
      LIMIT 1
    `
    return post ?? null
  } catch (error) {
    console.error(`获取文章 (slug: ${slug}) 错误:`, error)
    return null
  }
}

/**
 * 创建新文章
 */
export async function createPost(post: Omit<Post, "id" | "created_at" | "updated_at">): Promise<Post | null> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Cannot create post.")
    return null
  }
  try {
    const [newPost] = await sql<Post[]>`
      INSERT INTO posts (title, slug, content, excerpt, cover_image, published, is_featured, is_pinned)
      VALUES (
        ${post.title},
        ${post.slug},
        ${post.content},
        ${post.excerpt},
        ${post.cover_image},
        ${post.published},
        ${post.is_featured},
        ${post.is_pinned}
      )
      RETURNING id, title, slug, content, excerpt, cover_image, published, is_featured, is_pinned, created_at, updated_at
    `
    return newPost ?? null
  } catch (error) {
    console.error("创建文章错误:", error)
    return null
  }
}

/**
 * 更新文章
 */
export async function updatePost(
  id: string,
  post: Partial<Omit<Post, "id" | "created_at" | "updated_at">>,
): Promise<Post | null> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Cannot update post.")
    return null
  }
  try {
    const [updatedPost] = await sql<Post[]>`
      UPDATE posts
      SET
        title = COALESCE(${post.title}, title),
        slug = COALESCE(${post.slug}, slug),
        content = COALESCE(${post.content}, content),
        excerpt = COALESCE(${post.excerpt}, excerpt),
        cover_image = COALESCE(${post.cover_image}, cover_image),
        published = COALESCE(${post.published}, published),
        is_featured = COALESCE(${post.is_featured}, is_featured),
        is_pinned = COALESCE(${post.is_pinned}, is_pinned),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, title, slug, content, excerpt, cover_image, published, is_featured, is_pinned, created_at, updated_at
    `
    return updatedPost ?? null
  } catch (error) {
    console.error(`更新文章 (ID: ${id}) 错误:`, error)
    return null
  }
}

/**
 * 删除文章
 */
export async function deletePost(id: string): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Cannot delete post.")
    return false
  }
  try {
    const result = await sql`
      DELETE FROM posts
      WHERE id = ${id}
    `
    return result.count > 0
  } catch (error) {
    console.error(`删除文章 (ID: ${id}) 错误:`, error)
    return false
  }
}

/**
 * 将 Markdown 转换为 HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}

/**
 * 从 Markdown 提取摘要
 */
export function extractExcerpt(markdown: string, maxLength = 150): string {
  const text = remark().use(stripMarkdown).processSync(markdown).toString()
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength).trim() + "..."
}

/**
 * 生成文章 slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // 移除所有非单词字符、空格和连字符
    .replace(/\s+/g, "-") // 将空格替换为单个连字符
    .replace(/-+/g, "-") // 将多个连字符替换为单个连字符
    .trim() // 移除首尾空格
}
