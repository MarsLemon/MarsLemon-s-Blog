"use client"

import { useEffect, useState } from "react"
import { useRouter, notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/posts"
import { PostEditor } from "@/components/admin/post-editor"
import type { Post } from "@/lib/db" // Assuming Post type is also in lib/db

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Assuming params.id is the slug for fetching the post
        const fetchedPost = await getPostBySlug(params.id)
        if (fetchedPost) {
          setPost(fetchedPost)
        } else {
          notFound() // If post not found, trigger Next.js notFound
        }
      } catch (error) {
        console.error("Failed to fetch post:", error)
        notFound() // Handle error by showing not found page
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [params.id]) // Depend on params.id to refetch if slug changes

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
        <div>加载中...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>文章未找到</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">编辑文章</h1>
          <p className="text-muted-foreground">编辑您的博客文章</p>
        </div>

        <PostEditor post={post} onSave={handleSave} />
      </div>
    </div>
  )
}
