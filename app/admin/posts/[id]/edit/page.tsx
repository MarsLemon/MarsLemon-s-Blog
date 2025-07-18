import { notFound } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"
import { getPostById } from "@/lib/posts"
import { redirect } from "next/navigation"

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const postId = Number.parseInt(params.id)

  if (isNaN(postId)) {
    notFound()
  }

  const post = await getPostById(postId)

  if (!post) {
    notFound()
  }

  const handleSave = async (postData: any) => {
    "use server"

    try {
      const response = await fetch(
        `/api/admin/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "更新文章失败")
      }

      redirect("/admin")
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">编辑文章</h1>
      <PostEditor post={post} onSave={handleSave} />
    </div>
  )
}
