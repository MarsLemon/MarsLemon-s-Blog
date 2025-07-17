"use client"
import { useRouter } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"

export default function NewPostPage() {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">创建新文章</h1>
      <PostEditor onSave={handleSave} />
    </div>
  )
}
