import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/verify-token"
import { neon } from "@neondatabase/serverless"
import { generateSlug } from "@/lib/posts" // 确保这里导入 generateSlug

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const [post] = await sql`SELECT * FROM posts WHERE id = ${params.id}`
    if (!post) {
      return NextResponse.json({ message: "文章未找到" }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    console.error("获取文章详情失败:", error)
    return NextResponse.json({ message: "获取文章详情失败" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const { title, content, excerpt, cover_image, published, is_featured, is_pinned } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ message: "标题和内容不能为空" }, { status: 400 })
    }

    const slug = generateSlug(title) // 使用从 lib/posts 导入的 generateSlug

    const [updatedPost] = await sql`
      UPDATE posts
      SET
        title = ${title},
        content = ${content},
        excerpt = ${excerpt},
        cover_image = ${cover_image},
        published = ${published},
        is_featured = ${is_featured},
        is_pinned = ${is_pinned},
        slug = ${slug},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    if (!updatedPost) {
      return NextResponse.json({ message: "文章更新失败" }, { status: 404 })
    }

    return NextResponse.json(updatedPost)
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

    const result = await sql`DELETE FROM posts WHERE id = ${params.id}`

    if (result.count === 0) {
      return NextResponse.json({ message: "文章未找到" }, { status: 404 })
    }

    return NextResponse.json({ message: "文章删除成功" })
  } catch (error) {
    console.error("删除文章失败:", error)
    return NextResponse.json({ message: "删除文章失败" }, { status: 500 })
  }
}
