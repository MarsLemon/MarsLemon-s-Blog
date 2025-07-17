import { getPostBySlug, markdownToHtml } from "@/lib/posts"
import { notFound } from "next/navigation"
import Image from "next/image"
import { ViewTracker } from "@/components/view-tracker"

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const contentHtml = markdownToHtml(post.content)

  return (
    <div className="container mx-auto px-4 py-8">
      <ViewTracker postId={post.id} />
      <article className="max-w-3xl mx-auto">
        {post.cover_image && (
          <div className="mb-8">
            <Image
              src={post.cover_image || "/placeholder.svg"}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg object-cover"
              priority
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-muted-foreground text-sm mb-8">
          {post.author_avatar && (
            <Image
              src={post.author_avatar || "/placeholder.svg"}
              alt={post.author_name || "作者"}
              width={32}
              height={32}
              className="rounded-full mr-2"
            />
          )}
          <span>{post.author_name || "匿名作者"}</span>
          <span className="mx-2">·</span>
          <span>
            {new Date(post.created_at).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          {post.view_count && (
            <>
              <span className="mx-2">·</span>
              <span>{post.view_count} 次阅读</span>
            </>
          )}
        </div>
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </div>
  )
}
