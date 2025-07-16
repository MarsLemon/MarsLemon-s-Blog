import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/verify-token"
import { getPostBySlug, generateSlug, extractExcerpt } from "@/lib/posts"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const post = await getPostBySlug(params.id)
    if (!post) {
      return NextResponse.json({ message: "文章未找到" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("获取文章失败:", error)
    return NextResponse.json({ message: "获取文章失败" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, published, is_featured, is_pinned, cover_image } = body

    if (!title || !content) {
      return NextResponse.json({ message: "标题和内容是必填项" }, { status: 400 })
    }

    const slug = generateSlug(title)
    const excerpt = extractExcerpt(content)

    const [updatedPost] = await sql`
      UPDATE posts
      SET
        title = ${title},
        slug = ${slug},
        content = ${content},
        excerpt = ${excerpt},
        published = ${published},
        is_featured = ${is_featured},
        is_pinned = ${is_pinned},
        cover_image = ${cover_image},
        updated_at = NOW()
      WHERE slug = ${params.id}
      RETURNING *
    `

    if (!updatedPost) {
      return NextResponse.json({ message: "文章更新失败或未找到" }, { status: 404 })
    }

    return NextResponse.json({ message: "文章更新成功", post: updatedPost })
  } catch (error) {
    console.error("更新文章失败:", error)
    return NextResponse.json({ message: "更新文章失败" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const [deletedPost] = await sql`
      DELETE FROM posts
      WHERE slug = ${params.id}
      RETURNING id
    `

    if (!deletedPost) {
      return NextResponse.json({ message: "文章删除失败或未找到" }, { status: 404 })
    }

    return NextResponse.json({ message: "文章删除成功" })
  } catch (error) {
    console.error("删除文章失败:", error)
    return NextResponse.json({ message: "删除文章失败" }, { status: 500 })
  }
}
