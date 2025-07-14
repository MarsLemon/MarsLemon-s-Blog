import { PostCard } from "@/components/post-card"
import { getAllPosts } from "@/lib/posts"

export default async function BlogPage() {
  const allPosts = await getAllPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground">Insights, tutorials, and updates on modern web development</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {allPosts.map((post) => (
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
    </div>
  )
}
