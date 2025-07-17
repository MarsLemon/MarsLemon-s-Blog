"use client"

import { notFound } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"
import { getPostBySlug } from "@/lib/posts"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  // Assuming 'id' here is actually the slug for fetching
  const post = await getPostBySlug(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">编辑文章</h1>
      <PostEditor post={post} />
    </div>
  )
}
