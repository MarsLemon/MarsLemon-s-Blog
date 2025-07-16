import { neon } from "@neondatabase/serverless"

/**
 * DATABASE_URL 请在 Vercel 环境变量或本地 .env 中配置
 * 例如：postgres://user:password@host:5432/db
 */
if (!process.env.DATABASE_URL) {
  console.warn("[lib/posts] 缺少 DATABASE_URL，查询将返回空数组")
}

/* ---------- 数据库客户端 ---------- */
const sql =
  process.env.DATABASE_URL != null
    ? neon(process.env.DATABASE_URL)
    : // 缺少连接信息时返回空结果，避免编译期报错
      ((async () => []) as unknown as ReturnType<typeof neon>)

/* ---------- 类型，与 posts 表字段一致 ---------- */
export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  author_name: string | null
  author_avatar: string | null
  published: boolean
  is_featured: boolean
  is_pinned: boolean
  created_at: string
}

/* ---------- 查询函数 ---------- */

/** 全部已发布文章：置顶优先、时间倒序 */
export async function getAllPosts(): Promise<Post[]> {
  const rows = await sql<Post[]>`
    SELECT *
    FROM posts
    WHERE published = true
    ORDER BY is_pinned DESC, created_at DESC
  `
  return rows
}

/** 最新文章（排除精选），默认取 3 篇 */
export async function getRecentPosts(limit = 3): Promise<Post[]> {
  const rows = await sql<Post[]>`
    SELECT *
    FROM posts
    WHERE published = true
      AND is_featured = false
    ORDER BY is_pinned DESC, created_at DESC
    LIMIT ${limit}
  `
  return rows
}

/** 最新一篇精选文章 */
export async function getFeaturedPost(): Promise<Post | null> {
  const [post] = await sql<Post[]>`
    SELECT *
    FROM posts
    WHERE published = true
      AND is_featured = true
    ORDER BY created_at DESC
    LIMIT 1
  `
  return post ?? null
}

/** 根据 slug 获取单篇文章 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const [post] = await sql<Post[]>`
    SELECT *
    FROM posts
    WHERE slug = ${slug}
      AND published = true
    LIMIT 1
  `
  return post ?? null
}

/**
 * 兼容旧代码：getPosts(limit)
 * limit 为空 → getAllPosts
 * limit 有值 → getRecentPosts(limit)
 */
export async function getPosts(limit?: number): Promise<Post[]> {
  return typeof limit === "number" ? getRecentPosts(limit) : getAllPosts()
}
