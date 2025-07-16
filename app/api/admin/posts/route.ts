import { NextResponse } from "next/server"
import { getPosts, createPost, generateSlug } from "@/lib/posts"
import { getSessionUser } from "@/lib/auth"

export async function GET() {
  const user = await getSessionUser()
  if (!user || !user.is_admin) {
    return NextResponse.json({ message: "未授权" }, { status: 401 })
  }

  const posts = await getPosts()
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user || !user.is_admin) {
    return NextResponse.json({ message: "未授权" }, { status: 401 })
  }

  const data = await request.json()
  const slug = generateSlug(data.title)

  const newPost = await createPost({
    ...data,
    slug,
  })

  if (!newPost) {
    return NextResponse.json({ message: "创建文章失败" }, { status: 500 })
  }

  return NextResponse.json(newPost, { status: 201 })
}
