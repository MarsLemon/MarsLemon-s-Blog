import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { generateSlug, extractExcerpt } from "@/lib/posts"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("管理员获取博客列表请求")

    // 验证用户身份
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      console.log("用户未授权或非管理员")
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    console.log("管理员验证成功:", user.username)

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
      ORDER BY is_pinned DESC, created_at DESC
    `

    console.log(`获取到 ${posts.length} 篇文章`)
    return NextResponse.json(posts)
  } catch (error) {
    console.error("获取文章列表失败:", error)
    return NextResponse.json({ message: "获取文章列表失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("管理员创建博客请求")

    // 验证用户身份
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      console.log("用户未授权或非管理员")
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    console.log("管理员验证成功:", user.username)

    const body = await request.json()
    const { title, content, published, is_featured, is_pinned, cover_image } = body

    if (!title || !content) {
      console.log("标题或内容为空")
      return NextResponse.json({ message: "标题和内容是必填项" }, { status: 400 })
    }

    const slug = generateSlug(title)
    const excerpt = extractExcerpt(content)

    console.log("创建文章:", { title, slug, published, is_featured, is_pinned })

    const newPost = await sql`
      INSERT INTO posts (
        title, 
        slug, 
        content, 
        excerpt, 
        published, 
        is_featured, 
        is_pinned, 
        cover_image, 
        author_name, 
        author_avatar,
        created_at,
        updated_at
      )
      VALUES (
        ${title},
        ${slug},
        ${content},
        ${excerpt},
        ${published || false},
        ${is_featured || false},
        ${is_pinned || false},
        ${cover_image || null},
        ${user.username},
        ${user.avatar_url || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    console.log("文章创建成功:", newPost[0].id)
    return NextResponse.json({ message: "文章创建成功", post: newPost[0] }, { status: 201 })
  } catch (error) {
    console.error("创建文章失败:", error)
    return NextResponse.json({ message: "创建文章失败" }, { status: 500 })
  }
}
