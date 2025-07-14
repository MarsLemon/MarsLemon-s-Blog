import Link from "next/link"
import { FeaturedPost } from "@/components/featured-post"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { getFeaturedPost, getRecentPosts } from "@/lib/posts"

export default async function Home() {
  const featuredPost = await getFeaturedPost()
  const recentPosts = await getRecentPosts(3)

  return (
    <div className="container mx-auto px-4 py-8">
      {featuredPost && (
        <section className="mb-16">
          <FeaturedPost
            post={{
              title: featuredPost.title,
              excerpt: featuredPost.excerpt || "",
              date: new Date(featuredPost.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              author: {
                name: featuredPost.author_name,
                avatar: featuredPost.author_avatar,
              },
              coverImage: featuredPost.cover_image || "/placeholder.svg?height=600&width=1200",
              slug: featuredPost.slug,
            }}
          />
        </section>
      )}

      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Recent Posts</h2>
          <Link href="/blog">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                id: post.id.toString(),
                title: post.title,
                excerpt: post.excerpt || "",
                date: new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
                author: {
                  name: post.author_name,
                  avatar: post.author_avatar,
                },
                coverImage: post.cover_image || "/placeholder.svg?height=400&width=600",
                slug: post.slug,
              }}
            />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
          <p className="text-muted-foreground mb-6">Get the latest posts delivered right to your inbox</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
