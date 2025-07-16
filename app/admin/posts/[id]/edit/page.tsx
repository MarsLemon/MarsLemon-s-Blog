"use client"

import { useEffect } from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/posts"
import { PostEditor } from "@/components/admin/post-editor"
import type { Post } from "@/lib/db"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  // Assuming 'id' here is actually the slug for fetching
  const fetchedPost = await getPostBySlug(params.id)

  useEffect(() => {
    if (fetchedPost) {
      setPost(fetchedPost)
      setLoading(false)
    } else {
      notFound()
    }
  }, [fetchedPost])

  const handleSave = async (postData: any) => {
    try {
      const response = await fetch(`/api/admin/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        router.push("/admin")
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to update post")
      }
    } catch (error) {
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Post not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">编辑文章</h1>
          {/* <p className="text-muted-foreground">Edit your blog post</p> */}
        </div>

        <PostEditor post={post} onSave={handleSave} />
      </div>
    </div>
  )
}
