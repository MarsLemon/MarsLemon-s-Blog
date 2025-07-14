"use client"
import { useRouter } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"

export default function NewPost() {
  const router = useRouter()

  const handleSave = async (postData: any) => {
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        router.push("/admin")
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to create post")
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">New Post</h1>
          <p className="text-muted-foreground">Create a new blog post</p>
        </div>

        <PostEditor onSave={handleSave} />
      </div>
    </div>
  )
}
