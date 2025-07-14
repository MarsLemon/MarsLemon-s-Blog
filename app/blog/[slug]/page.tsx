import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
        Back to home
      </Link>

      <article className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
          <div className="flex items-center gap-3 mb-8">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author_avatar || "/placeholder.svg"} alt={post.author_name} />
              <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author_name}</div>
              <div className="text-sm text-muted-foreground">{post.author_bio}</div>
            </div>
          </div>
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
          <h3 className="text-lg font-bold mb-4">Share this post</h3>
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
