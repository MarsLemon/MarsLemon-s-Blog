import { NextResponse } from "next/server"
import { getPostBySlug, updatePost, deletePost } from "@/lib/posts"
import { getSessionUser } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user || !user.is_admin) {
    return NextResponse.json({ message: "未授权" }, { status: 401 })
  }

  const { id } = params
  const post = await getPostBySlug(id) // Assuming ID is used as slug for admin API

  if (!post) {
    return NextResponse.json({ message: "文章未找到" }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user || !user.is_admin) {
    return NextResponse.json({ message: "未授权" }, { status: 401 })
  }

  const { id } = params
  const data = await request.json()

  const updatedPost = await updatePost(id, data)

  if (!updatedPost) {
    return NextResponse.json({ message: "更新文章失败" }, { status: 500 })
  }

  return NextResponse.json(updatedPost)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user || !user.is_admin) {
    return NextResponse.json({ message: "未授权" }, { status: 401 })
  }

  const { id } = params
  const success = await deletePost(id)

  if (!success) {
    return NextResponse.json({ message: "删除文章失败" }, { status: 500 })
  }

  return NextResponse.json({ message: "文章删除成功" })
}
