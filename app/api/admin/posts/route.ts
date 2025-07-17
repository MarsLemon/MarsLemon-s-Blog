import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/lib/verify-token"
import { generateSlug, extractExcerpt } from "@/lib/posts"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "需要管理员权限" }, { status: 403 })
    }

    // 获取所有文章（包括未发布的）
    const posts = await sql`
      SELECT 
        id, title, content, excerpt, slug, cover_image,
        author_name, author_avatar, created_at, updated_at,
        published, is_featured, is_pinned
      FROM posts 
      ORDER BY created_at DESC
    `

    return NextResponse.json(posts)
  } catch (error) {
    console.error("获取管理员文章列表错误:", error)
    return NextResponse.json({ message: "获取文章列表失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "需要管理员权限" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, cover_image, published, is_featured, is_pinned } = body

    if (!title || !content) {
      return NextResponse.json({ message: "标题和内容是必填项" }, { status: 400 })
    }

    const slug = generateSlug(title)
    const excerpt = extractExcerpt(content)

    // 检查slug是否已存在
    const existingPost = await sql`
      SELECT id FROM posts WHERE slug = ${slug}
    `

    if (existingPost.length > 0) {
      return NextResponse.json({ message: "文章标题已存在，请使用不同的标题" }, { status: 400 })
    }

    // 创建新文章
    const result = await sql`
      INSERT INTO posts (
        title, content, excerpt, slug, cover_image,
        author_name, author_avatar, published, is_featured, is_pinned
      ) VALUES (
        ${title}, ${content}, ${excerpt}, ${slug}, ${cover_image || null},
        ${user.username}, ${user.avatar_url || null}, 
        ${published || false}, ${is_featured || false}, ${is_pinned || false}
      )
      RETURNING id, title, slug, created_at
    `

    return NextResponse.json({
      message: "文章创建成功",
      post: result[0],
    })
  } catch (error) {
    console.error("创建文章错误:", error)
    return NextResponse.json({ message: "创建文章失败" }, { status: 500 })
  }
}
