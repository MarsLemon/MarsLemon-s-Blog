import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/verify-token"
import { neon } from "@neondatabase/serverless"
import { generateSlug } from "@/lib/posts" // Assuming generateSlug is in lib/posts

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC`
    return NextResponse.json(posts)
  } catch (error) {
    console.error("获取文章列表失败:", error)
    return NextResponse.json({ message: "获取文章列表失败" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ message: "未授权" }, { status: 401 })
    }

    const { title, content, excerpt, cover_image, published, is_featured, is_pinned } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ message: "标题和内容不能为空" }, { status: 400 })
    }

    const slug = generateSlug(title)

    const [newPost] = await sql`
      INSERT INTO posts (title, content, excerpt, cover_image, published, is_featured, is_pinned, slug, created_at, updated_at)
      VALUES (${title}, ${content}, ${excerpt}, ${cover_image}, ${published}, ${is_featured}, ${is_pinned}, ${slug}, NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("创建文章失败:", error)
    return NextResponse.json({ message: "创建文章失败" }, { status: 500 })
  }
}
