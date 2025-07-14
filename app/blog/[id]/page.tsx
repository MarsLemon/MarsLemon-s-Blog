import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPostById } from "@/lib/blog-storage"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface BlogPostPageProps {
  params: Promise<{ id: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params
  const post = getPostById(id)

  if (!post || !post.published) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // 简单的markdown渲染
  const renderMarkdown = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, "<br>")
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回博客列表
      </Link>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-3xl">{post.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>发布于 {formatDate(post.publishedAt!)}</span>
              {post.updatedAt.getTime() !== post.createdAt.getTime() && (
                <span>• 更新于 {formatDate(post.updatedAt)}</span>
              )}
              <Badge variant="secondary">已发布</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: `<p class="mb-4">${renderMarkdown(post.content)}</p>`,
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
