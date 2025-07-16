import { neon } from "@neondatabase/serverless"
import { remark } from "remark"
import html from "remark-html"

const sql = neon(process.env.DATABASE_URL!)

export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  published: boolean
  created_at: string
  updated_at: string
  author_name?: string
}

// 获取所有文章
export async function getPosts(limit?: number): Promise<Post[]> {
  try {
    const result = await sql`
      SELECT *
      FROM posts
      WHERE published = true
      ORDER BY created_at DESC
      ${limit ? sql`LIMIT ${limit}` : sql``}
    `
    return result as Post[]
  } catch (error) {
    console.error("获取文章错误:", error)
    return []
  }
}

// 根据slug获取文章
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const result = await sql`
      SELECT *
      FROM posts
      WHERE slug = ${slug} AND published = true
      LIMIT 1
    `

    return (result[0] as Post) || null
  } catch (error) {
    console.error("根据slug获取文章错误:", error)
    return null
  }
}

// 获取精选文章
export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  try {
    const result = await sql`
      SELECT *
      FROM posts
      WHERE published = true AND featured_image IS NOT NULL
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return result as Post[]
  } catch (error) {
    console.error("获取精选文章错误:", error)
    return []
  }
}

// 获取所有文章（管理员用）
export async function getAllPosts(): Promise<Post[]> {
  try {
    const result = await sql`
      SELECT *
      FROM posts
      ORDER BY created_at DESC
    `

    return result as Post[]
  } catch (error) {
    console.error("获取所有文章错误:", error)
    return []
  }
}

// 根据ID获取文章
export async function getPostById(id: number): Promise<Post | null> {
  try {
    const result = await sql`
      SELECT *
      FROM posts
      WHERE id = ${id}
      LIMIT 1
    `

    return (result[0] as Post) || null
  } catch (error) {
    console.error("根据ID获取文章错误:", error)
    return null
  }
}

// 创建文章
export async function createPost(
  title: string,
  slug: string,
  content: string,
  excerpt: string,
  featuredImage: string | null,
  published: boolean,
): Promise<Post | null> {
  try {
    const result = await sql`
      INSERT INTO posts (title, slug, content, excerpt, featured_image, published)
      VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${featuredImage}, ${published})
      RETURNING *
    `

    return (result[0] as Post) || null
  } catch (error) {
    console.error("创建文章错误:", error)
    return null
  }
}

// 更新文章
export async function updatePost(
  id: number,
  title: string,
  slug: string,
  content: string,
  excerpt: string,
  featuredImage: string | null,
  published: boolean,
): Promise<Post | null> {
  try {
    const result = await sql`
      UPDATE posts
      SET title = ${title},
          slug = ${slug},
          content = ${content},
          excerpt = ${excerpt},
          featured_image = ${featuredImage},
          published = ${published},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return (result[0] as Post) || null
  } catch (error) {
    console.error("更新文章错误:", error)
    return null
  }
}

// 删除文章
export async function deletePost(id: number): Promise<boolean> {
  try {
    await sql`DELETE FROM posts WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("删除文章错误:", error)
    return false
  }
}

// Markdown转HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await remark().use(html).process(markdown)
    return result.toString()
  } catch (error) {
    console.error("Markdown转换错误:", error)
    return markdown
  }
}
