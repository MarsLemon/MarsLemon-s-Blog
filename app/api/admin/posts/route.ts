import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { generateSlug, extractExcerpt } from "@/lib/posts"
import { verifyAdminToken } from "@/lib/verify-token"

export async function GET() {
  try {
    const posts = await sql`
      SELECT * FROM posts 
      ORDER BY is_pinned DESC, created_at DESC
    `
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const isValid = await verifyAdminToken(request)
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, cover_image, is_featured, is_pinned } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const slug = generateSlug(title)
    const excerpt = extractExcerpt(content)

    // Check if slug already exists
    const existingPost = await sql`SELECT id FROM posts WHERE slug = ${slug}`
    if (existingPost.length > 0) {
      return NextResponse.json({ error: "A post with this title already exists" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO posts (title, slug, excerpt, content, cover_image, is_featured, is_pinned)
      VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${cover_image || null}, ${is_featured || false}, ${is_pinned || false})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
