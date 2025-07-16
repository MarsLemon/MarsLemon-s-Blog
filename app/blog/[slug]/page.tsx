import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getPostBySlug, markdownToHtml } from "@/lib/posts"

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const htmlContent = markdownToHtml(post.content)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回首页
      </Link>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-muted-foreground text-sm mb-6">
          发布于{" "}
          {new Date(post.created_at).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
          {post.author_name && ` by ${post.author_name}`}
        </div>
        {post.cover_image && (
          <div className="relative h-[400px] w-full mb-8">
            <Image
              src={post.cover_image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}
        <div
          className="prose prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="border-t mt-12 pt-8">
          <h3 className="text-lg font-bold mb-4">分享此文章</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Twitter
            </Button>
            <Button variant="outline" size="sm">
              Facebook
            </Button>
            <Button variant="outline" size="sm">
              LinkedIn
            </Button>
          </div>
        </div>
      </article>
    </div>
  )
}
