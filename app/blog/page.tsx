import { Suspense } from "react"
import { PostCard } from "@/components/post-card"
import { Card, CardContent } from "@/components/ui/card"
import { getPosts } from "@/lib/posts"

export const metadata = {
  title: "博客 - 开发博客",
  description: "浏览所有关于现代Web开发的文章",
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">博客文章</h1>
        <p className="text-xl text-muted-foreground">探索现代Web开发的最新技术和最佳实践</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">暂无文章发布</p>
            </CardContent>
          </Card>
        )}
      </Suspense>
    </div>
  )
}
