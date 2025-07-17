import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/verify-token"
import { generateSlug, extractExcerpt } from "@/lib/posts"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
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

    const [newPost] = await sql`
      INSERT INTO posts (title, slug, content, excerpt, published, is_featured, is_pinned, cover_image, author_name, author_avatar)
      VALUES (
        ${title},
        ${slug},
        ${content},
        ${excerpt},
        ${published},
        ${is_featured},
        ${is_pinned},
        ${cover_image},
        ${user.username}, -- 使用当前登录用户的用户名作为作者
        ${user.avatar_url} -- 使用当前登录用户的头像作为作者头像
      )
      RETURNING *
    `

    return NextResponse.json({ message: "文章创建成功", post: newPost }, { status: 201 })
  } catch (error) {
    console.error("创建文章失败:", error)
    return NextResponse.json({ message: "创建文章失败" }, { status: 500 })
  }
}
