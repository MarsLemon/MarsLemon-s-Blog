import { neon } from "@neondatabase/serverless"

/*
 * 数据库连接（Neon Serverless）
 * 在 Vercel 环境下，DATABASE_URL 会自动注入
 */
const sql = neon(process.env.DATABASE_URL!)

/**
 * 与 posts 表字段保持一致的类型
 * 这里只列出前端真正会用到的字段
 */
export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  author_name: string | null
  author_avatar: string | null
  is_featured: boolean
  is_pinned: boolean
  published: boolean
  created_at: string
}

/* ─────────── 文章查询函数 ─────────── */

/** 获取全部已发布文章（时间降序 + 置顶优先） */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await sql<Post[]>`
    SELECT *
    FROM posts
    WHERE published = true
    ORDER BY is_pinned DESC, created_at DESC
  `
  return posts
}

/** 根据 slug 获取单篇文章 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const [post] = await sql<Post[]>`
    SELECT *
    FROM posts
    WHERE slug = ${slug} AND published = true
    LIMIT 1
  `
  return post ?? null
}

/** 获取最新一篇“精选文章” */
export async function getFeaturedPost(): Promise<Post | null> {
  const [post] = await sql<Post[]>`
    SELECT *
    FROM posts
    WHERE is_featured = true AND published = true
    ORDER BY created_at DESC
    LIMIT 1
  `
  return post ?? null
}

/** 获取最近文章（排除精选，默认 3 篇） */
export async function getRecentPosts(limit = 3): Promise<Post[]> {
  const posts = await sql<Post[]>`
    SELECT *
    FROM posts
    WHERE published = true AND is_featured = false
    ORDER BY is_pinned DESC, created_at DESC
    LIMIT ${limit}
  `
  return posts
}

/**
 * 同步暴露 getPosts（首页中文代码里使用）
 * 实际等价于 getAllPosts
 */
export async function getPosts(limit?: number): Promise<Post[]> {
  return limit ? getRecentPosts(limit) : getAllPosts()
}
