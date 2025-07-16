import { notFound } from "next/navigation"
import { getPostBySlug, markdownToHtml } from "@/lib/posts"
import Image from "next/image"

export const revalidate = 60 // Revalidate every 60 seconds

interface PostPageProps {
  params: {
    slug: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const contentHtml = await markdownToHtml(post.content || "")

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-3xl">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        {post.cover_image && (
          <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.cover_image || "/placeholder.svg"}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-muted-foreground text-sm mb-8">
          发布于{" "}
          {new Date(post.created_at).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
        </div>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </div>
  )
}
