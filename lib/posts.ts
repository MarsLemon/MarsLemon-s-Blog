import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Post {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  is_published: boolean
  is_featured: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export async function getPosts(limit?: number): Promise<Post[]> {
  try {
    const query = limit
      ? sql`SELECT * FROM posts WHERE is_published = true ORDER BY is_pinned DESC, created_at DESC LIMIT ${limit}`
      : sql`SELECT * FROM posts WHERE is_published = true ORDER BY is_pinned DESC, created_at DESC`

    const posts = await query
    return posts as Post[]
  } catch (error) {
    console.error("获取文章错误:", error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const result = await sql`
      SELECT * FROM posts 
      WHERE slug = ${slug} AND is_published = true 
      LIMIT 1
    `
    return (result[0] as Post) || null
  } catch (error) {
    console.error("获取文章错误:", error)
    return null
  }
}

export async function getFeaturedPosts(): Promise<Post[]> {
  try {
    const posts = await sql`
      SELECT * FROM posts 
      WHERE is_published = true AND is_featured = true 
      ORDER BY created_at DESC 
      LIMIT 3
    `
    return posts as Post[]
  } catch (error) {
    console.error("获取推荐文章错误:", error)
    return []
  }
}
