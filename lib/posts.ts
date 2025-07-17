import { neon } from "@neondatabase/serverless"
import slugify from "slugify"
import { env } from "@/lib/env"
import { markdownToHtml } from "./markdown"
import type { Post } from "./db"

const sql = neon(env.DATABASE_URL!)

export async function getAllPosts(): Promise<Post[]> {
  const posts = await sql`
    SELECT 
      p.id, p.title, p.content, p.excerpt, p.slug, p.cover_image,
      u.username AS author_name, u.avatar_url AS author_avatar,
      p.created_at, p.updated_at, p.published, p.is_featured, p.is_pinned, p.view_count
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.published = TRUE
    ORDER BY p.is_pinned DESC, p.created_at DESC
  `
  return posts as Post[]
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await sql`
    SELECT 
      p.id, p.title, p.content, p.excerpt, p.slug, p.cover_image,
      u.username AS author_name, u.avatar_url AS author_avatar,
      p.created_at, p.updated_at, p.published, p.is_featured, p.is_pinned, p.view_count
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.slug = ${slug} AND p.published = TRUE
  `
  return posts[0] as Post | undefined
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const posts = await sql`
    SELECT 
      p.id, p.title, p.content, p.excerpt, p.slug, p.cover_image,
      u.username AS author_name, u.avatar_url AS author_avatar,
      p.created_at, p.updated_at, p.published, p.is_featured, p.is_pinned, p.view_count
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.id = ${id}
  `
  return posts[0] as Post | undefined
}

export function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true })
}

export function extractExcerpt(content: string, maxLength = 150): string {
  const plainText = content.replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags if any
  if (plainText.length <= maxLength) {
    return plainText
  }
  return plainText.substring(0, plainText.lastIndexOf(" ", maxLength)) + "..."
}

export { markdownToHtml }
