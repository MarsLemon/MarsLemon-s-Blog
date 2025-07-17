import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/lib/verify-token"
import { generateSlug, extractExcerpt } from "@/lib/posts"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "需要管理员权限" }, { status: 403 })
    }

    const postId = Number.parseInt(params.id)
    if (isNaN(postId)) {
      return NextResponse.json({ message: "无效的文章ID" }, { status: 400 })
    }

    const posts = await sql`
      SELECT 
        id, title, content, excerpt, slug, cover_image,
        author_name, author_avatar, created_at, updated_at,
        published, is_featured, is_pinned
      FROM posts 
      WHERE id = ${postId}
    `

    if (posts.length === 0) {
      return NextResponse.json({ message: "文章不存在" }, { status: 404 })
    }

    return NextResponse.json(posts[0])
  } catch (error) {
    console.error("获取文章详情错误:", error)
    return NextResponse.json({ message: "获取文章详情失败" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "需要管理员权限" }, { status: 403 })
    }

    const postId = Number.parseInt(params.id)
    if (isNaN(postId)) {
      return NextResponse.json({ message: "无效的文章ID" }, { status: 400 })
    }

    const body = await request.json()
    const { title, content, cover_image, published, is_featured, is_pinned } = body

    if (!title || !content) {
      return NextResponse.json({ message: "标题和内容是必填项" }, { status: 400 })
    }

    const slug = generateSlug(title)
    const excerpt = extractExcerpt(content)

    // 检查slug是否已被其他文章使用
    const existingPost = await sql`
      SELECT id FROM posts WHERE slug = ${slug} AND id != ${postId}
    `

    if (existingPost.length > 0) {
      return NextResponse.json({ message: "文章标题已存在，请使用不同的标题" }, { status: 400 })
    }

    // 更新文章
    const result = await sql`
      UPDATE posts SET
        title = ${title},
        content = ${content},
        excerpt = ${excerpt},
        slug = ${slug},
        cover_image = ${cover_image || null},
        published = ${published || false},
        is_featured = ${is_featured || false},
        is_pinned = ${is_pinned || false},
        updated_at = NOW()
      WHERE id = ${postId}
      RETURNING id, title, slug, updated_at
    `

    if (result.length === 0) {
      return NextResponse.json({ message: "文章不存在" }, { status: 404 })
    }

    return NextResponse.json({
      message: "文章更新成功",
      post: result[0],
    })
  } catch (error) {
    console.error("更新文章错误:", error)
    return NextResponse.json({ message: "更新文章失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "需要管理员权限" }, { status: 403 })
    }

    const postId = Number.parseInt(params.id)
    if (isNaN(postId)) {
      return NextResponse.json({ message: "无效的文章ID" }, { status: 400 })
    }

    // 删除文章
    const result = await sql`
      DELETE FROM posts WHERE id = ${postId}
      RETURNING id, title
    `

    if (result.length === 0) {
      return NextResponse.json({ message: "文章不存在" }, { status: 404 })
    }

    return NextResponse.json({
      message: "文章删除成功",
      post: result[0],
    })
  } catch (error) {
    console.error("删除文章错误:", error)
    return NextResponse.json({ message: "删除文章失败" }, { status: 500 })
  }
}
