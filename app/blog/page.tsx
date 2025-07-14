import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPublishedPosts } from "@/lib/blog-storage"
import Link from "next/link"

export default function BlogPage() {
  const posts = getPublishedPosts()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">博客</h1>
        <p className="text-muted-foreground mt-2">分享技术见解和思考</p>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">暂无发布的文章</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Link href={`/blog/${post.id}`}>
                      <CardTitle className="hover:text-primary cursor-pointer">{post.title}</CardTitle>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(post.publishedAt!)}</span>
                      <Badge variant="secondary">已发布</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{post.content.substring(0, 200)}...</p>
                <Link href={`/blog/${post.id}`} className="inline-block mt-4 text-primary hover:underline">
                  阅读更多 →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
