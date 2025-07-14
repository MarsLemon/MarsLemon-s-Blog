import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { generateSlug, extractExcerpt } from "@/lib/posts"
import { verifyAdminToken } from "@/lib/verify-token"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isValid = await verifyAdminToken(request)
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, cover_image, is_featured, is_pinned } = await request.json()
    const id = Number.parseInt(params.id)

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const slug = generateSlug(title)
    const excerpt = extractExcerpt(content)

    // Check if slug already exists for other posts
    const existingPost = await sql`SELECT id FROM posts WHERE slug = ${slug} AND id != ${id}`
    if (existingPost.length > 0) {
      return NextResponse.json({ error: "A post with this title already exists" }, { status: 400 })
    }

    const result = await sql`
      UPDATE posts 
      SET title = ${title}, slug = ${slug}, excerpt = ${excerpt}, content = ${content}, 
          cover_image = ${cover_image || null}, is_featured = ${is_featured || false}, 
          is_pinned = ${is_pinned || false}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isValid = await verifyAdminToken(request)
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    const result = await sql`DELETE FROM posts WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
