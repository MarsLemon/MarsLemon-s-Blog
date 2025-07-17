import { getAllPosts } from "@/lib/posts"
import { FeaturedPost } from "@/components/featured-post"
import { PostCard } from "@/components/post-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default async function Home() {
  const posts = await getAllPosts()
  const featuredPost = posts.find((post) => post.is_featured)
  const recentPosts = posts.filter((post) => !post.is_featured).slice(0, 6) // Get up to 6 recent non-featured posts

  return (
    <div className="container mx-auto px-4 py-8">
      {featuredPost && <FeaturedPost post={featuredPost} />}

      <section className="my-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">最新文章</h2>
          <Button variant="link" asChild>
            <Link href="/blog">
              查看所有文章
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无最新文章。</p>
          </div>
        )}
      </section>
    </div>
  )
}
