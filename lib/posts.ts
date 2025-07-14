import { sql, type Post } from "./db"
import { marked } from "marked"

export async function getAllPosts(): Promise<Post[]> {
  const posts = await sql`
    SELECT * FROM posts 
    WHERE published = true 
    ORDER BY is_pinned DESC, created_at DESC
  `
  return posts as Post[]
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await sql`
    SELECT * FROM posts 
    WHERE slug = ${slug} AND published = true 
    LIMIT 1
  `
  return posts.length > 0 ? (posts[0] as Post) : null
}

export async function getFeaturedPost(): Promise<Post | null> {
  const posts = await sql`
    SELECT * FROM posts 
    WHERE is_featured = true AND published = true 
    ORDER BY created_at DESC 
    LIMIT 1
  `
  return posts.length > 0 ? (posts[0] as Post) : null
}

export async function getRecentPosts(limit = 3): Promise<Post[]> {
  const posts = await sql`
    SELECT * FROM posts 
    WHERE published = true AND is_featured = false
    ORDER BY is_pinned DESC, created_at DESC 
    LIMIT ${limit}
  `
  return posts as Post[]
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function markdownToHtml(markdown: string): string {
  return marked(markdown)
}

export function extractExcerpt(content: string, length = 160): string {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/`(.*?)`/g, "$1") // Remove inline code
    .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links
    .replace(/\n/g, " ") // Replace newlines with spaces
    .trim()

  return plainText.length > length ? plainText.substring(0, length) + "..." : plainText
}
