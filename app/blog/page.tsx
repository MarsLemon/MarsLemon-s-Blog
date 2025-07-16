import { getPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight mb-8">所有文章</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
