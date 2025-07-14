"use server"

import { createPost, updatePost, publishPost, unpublishPost, deletePost } from "@/lib/blog-storage"
import { revalidatePath } from "next/cache"

export async function createPostAction(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  if (!title || !content) {
    return { success: false, error: "标题和内容不能为空" }
  }

  const post = createPost(title, content)
  revalidatePath("/admin")
  return { success: true, post }
}

export async function updatePostAction(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  if (!id || !title || !content) {
    return { success: false, error: "参数不完整" }
  }

  const post = updatePost(id, title, content)
  if (!post) {
    return { success: false, error: "文章不存在" }
  }

  revalidatePath("/admin")
  return { success: true, post }
}

export async function publishPostAction(id: string) {
  const post = publishPost(id)
  if (!post) {
    return { success: false, error: "文章不存在" }
  }

  revalidatePath("/admin")
  revalidatePath("/blog")
  return { success: true, post }
}

export async function unpublishPostAction(id: string) {
  const post = unpublishPost(id)
  if (!post) {
    return { success: false, error: "文章不存在" }
  }

  revalidatePath("/admin")
  revalidatePath("/blog")
  return { success: true, post }
}

export async function deletePostAction(id: string) {
  const success = deletePost(id)
  if (!success) {
    return { success: false, error: "文章不存在" }
  }

  revalidatePath("/admin")
  revalidatePath("/blog")
  return { success: true }
}
