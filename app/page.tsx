import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FeaturedPost } from "@/components/featured-post"
import { PostCard } from "@/components/post-card"
import { getFeaturedPost, getRecentPosts } from "@/lib/posts.ts"

export default async function HomePage() {
  const featuredPost = await getFeaturedPost()
  const recentPosts = await getRecentPosts()

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">欢迎来到开发博客</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          探索现代Web开发的最新技术、最佳实践和深度见解。从React到Next.js，从设计到部署。
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/blog">浏览文章</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">了解更多</Link>
          </Button>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">精选文章</h2>
          <FeaturedPost post={featuredPost} />
        </section>
      )}

      {/* Recent Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">最新文章</h2>
          <Button asChild variant="outline">
            <Link href="/blog">查看全部</Link>
          </Button>
        </div>

        {recentPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
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
      </section>

      {/* Features Section */}
      <section className="py-12 mt-12">
        <h2 className="text-3xl font-bold text-center mb-12">为什么选择我们？</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>深度技术分析</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>深入探讨前端技术栈，从基础概念到高级应用，帮助开发者提升技能。</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>实战项目经验</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>分享真实项目开发经验，包括架构设计、性能优化和最佳实践。</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>持续更新内容</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>紧跟技术发展趋势，定期更新最新的开发工具和框架使用指南。</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
