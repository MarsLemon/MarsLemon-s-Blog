import { sql } from "@vercel/postgres"

export interface Post {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  published: boolean
  is_featured: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export async function getPosts(limit?: number) {
  const query = limit
    ? sql`SELECT * FROM posts WHERE published = true ORDER BY is_pinned DESC, created_at DESC LIMIT ${limit}`
    : sql`SELECT * FROM posts WHERE published = true ORDER BY is_pinned DESC, created_at DESC`
  const result = await query
  return result.rows as Post[]
}

export async function getPostBySlug(slug: string) {
  const result = await sql`
  SELECT * FROM posts
  WHERE slug = ${slug} AND published = true
  LIMIT 1
`
  return result.rows[0] as Post | undefined
}

export async function getFeaturedPosts() {
  const posts = await sql`
  SELECT * FROM posts
  WHERE published = true AND is_featured = true
  ORDER BY created_at DESC
  LIMIT 3
`
  return posts.rows as Post[]
}

export async function createPost(
  title: string,
  slug: string,
  content: string,
  excerpt: string,
  featuredImage: string,
  published: boolean,
) {
  await sql`
    INSERT INTO posts (title, slug, content, excerpt, featured_image, published, is_featured, is_pinned)
    VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${featuredImage}, ${published}, false, false)
  `
}

export async function updatePost(
  id: number,
  title: string,
  slug: string,
  content: string,
  excerpt: string,
  featuredImage: string,
  published: boolean,
) {
  await sql`
    UPDATE posts
    SET title = ${title},
    slug = ${slug},
    content = ${content},
    excerpt = ${excerpt},
    featured_image = ${featuredImage},
    published = ${published},
    updated_at = NOW()
    WHERE id = ${id}
  `
}
