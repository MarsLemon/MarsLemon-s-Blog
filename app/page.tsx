import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getFeaturedPost, getRecentPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { FeaturedPost } from "@/components/featured-post"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const featuredPost = await getFeaturedPost()
  const recentPosts = await getRecentPosts(5)

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      {featuredPost && <FeaturedPost post={featuredPost} />}

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">最新文章</h2>
          <Button asChild variant="link">
            <Link href="/blog">查看所有</Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>关于我们</CardTitle>
            <CardDescription>了解更多关于我们的博客和团队。</CardDescription>
          </CardHeader>
          <CardContent>
            <p>这是一个由 Vercel AI 驱动的博客模板。我们致力于分享最新的技术、见解和故事。</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
