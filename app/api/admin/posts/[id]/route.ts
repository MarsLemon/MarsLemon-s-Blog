import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { generateSlug, extractExcerpt } from "@/lib/posts"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("获取单个博客请求:", params.id)

    // 验证用户身份
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      console.log("用户未授权或非管理员")
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const postId = Number.parseInt(params.id)
    if (isNaN(postId)) {
      return NextResponse.json({ message: "无效的文章ID" }, { status: 400 })
    }

    const posts = await sql`
      SELECT 
        id, 
        title, 
        slug, 
        excerpt, 
        content, 
        cover_image, 
        published, 
        is_featured, 
        is_pinned, 
        author_name, 
        author_avatar, 
        created_at, 
        updated_at
      FROM posts 
      WHERE id = ${postId}
    `

    if (posts.length === 0) {
      return NextResponse.json({ message: "文章未找到" }, { status: 404 })
    }

    console.log("获取文章成功:", posts[0].title)
    return NextResponse.json(posts[0])
  } catch (error) {
    console.error("获取文章失败:", error)
    return NextResponse.json({ message: "获取文章失败" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("更新博客请求:", params.id)

    // 验证用户身份
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      console.log("用户未授权或非管理员")
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const postId = Number.parseInt(params.id)
    if (isNaN(postId)) {
      return NextResponse.json({ message: "无效的文章ID" }, { status: 400 })
    }

    const body = await request.json()
    const { title, content, published, is_featured, is_pinned, cover_image } = body

    if (!title || !content) {
      console.log("标题或内容为空")
      return NextResponse.json({ message: "标题和内容是必填项" }, { status: 400 })
    }

    const slug = generateSlug(title)
    const excerpt = extractExcerpt(content)

    console.log("更新文章:", { postId, title, slug, published, is_featured, is_pinned })

    const updatedPost = await sql`
      UPDATE posts
      SET
        title = ${title},
        slug = ${slug},
        content = ${content},
        excerpt = ${excerpt},
        published = ${published || false},
        is_featured = ${is_featured || false},
        is_pinned = ${is_pinned || false},
        cover_image = ${cover_image || null},
        updated_at = NOW()
      WHERE id = ${postId}
      RETURNING *
    `

    if (updatedPost.length === 0) {
      return NextResponse.json({ message: "文章更新失败或未找到" }, { status: 404 })
    }

    console.log("文章更新成功:", updatedPost[0].id)
    return NextResponse.json({ message: "文章更新成功", post: updatedPost[0] })
  } catch (error) {
    console.error("更新文章失败:", error)
    return NextResponse.json({ message: "更新文章失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("删除博客请求:", params.id)

    // 验证用户身份
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      console.log("用户未授权或非管理员")
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const postId = Number.parseInt(params.id)
    if (isNaN(postId)) {
      return NextResponse.json({ message: "无效的文章ID" }, { status: 400 })
    }

    console.log("删除文章ID:", postId)

    const deletedPost = await sql`
      DELETE FROM posts
      WHERE id = ${postId}
      RETURNING id, title
    `

    if (deletedPost.length === 0) {
      return NextResponse.json({ message: "文章删除失败或未找到" }, { status: 404 })
    }

    console.log("文章删除成功:", deletedPost[0].title)
    return NextResponse.json({ message: "文章删除成功" })
  } catch (error) {
    console.error("删除文章失败:", error)
    return NextResponse.json({ message: "删除文章失败" }, { status: 500 })
  }
}
