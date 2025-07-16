import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/posts"
import { PostEditor } from "@/components/admin/post-editor"

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPostBySlug(params.id) // Assuming ID is used as slug for admin editing

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">编辑文章</h1>
      <PostEditor post={post} />
    </div>
  )
}
