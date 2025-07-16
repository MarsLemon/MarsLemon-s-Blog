import { neon } from "@neondatabase/serverless"

/**
 * 建议：在 Vercel「环境变量」里配置 DATABASE_URL
 * 例如：postgres://user:password@host/db
 */
if (!process.env.DATABASE_URL) {
  console.warn("[lib/posts] 缺少 DATABASE_URL 环境变量，所有文章查询将返回空数组。")
}

const sql =
  process.env.DATABASE_URL != null
    ? neon(process.env.DATABASE_URL)
    : // 若本地未配置数据库，也避免运行时报错
      ((async () => {
        throw new Error("DATABASE_URL 未配置")
      }) as unknown as ReturnType<typeof neon>)

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

/* ─────────── 查询函数 ─────────── */

/** 获取全部已发布文章（置顶优先，其次时间倒序） */
export async function getAllPosts(): Promise<Post[]> {
  if (typeof sql !== "function") return []
  const rows = await sql<Post[]>`
    SELECT *
    FROM posts
    WHERE published = true
    ORDER BY is_pinned DESC, created_at DESC
  `
  return rows
}

/** 首页最新文章（排除精选） */
export async function getRecentPosts(limit = 3): Promise<Post[]> {
  if (typeof sql !== "function") return []
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
  if (typeof sql !== "function") return null
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

/** 通用别名：getPosts — 若传 limit 则调用 getRecentPosts，否则 getAllPosts */
export async function getPosts(limit?: number): Promise<Post[]> {
  return limit != null ? getRecentPosts(limit) : getAllPosts()
}

/** 根据 slug 获取文章详情 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (typeof sql !== "function") return null
  const [post] = await sql<Post[]>`
    SELECT *
    FROM posts
    WHERE slug = ${slug}
      AND published = true
    LIMIT 1
  `
  return post ?? null
}
