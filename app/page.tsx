import Link from "next/link"
import { FeaturedPost } from "@/components/featured-post"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"

export default function Home() {
  // This would typically come from a CMS or API
  const featuredPost = {
    id: "1",
    title: "Getting Started with Next.js 15",
    excerpt: "Learn how to build modern web applications with the latest version of Next.js",
    date: "May 15, 2025",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    coverImage: "/placeholder.svg?height=600&width=1200",
    slug: "getting-started-with-nextjs-15",
  }

  const recentPosts = [
    {
      id: "2",
      title: "Building Accessible Web Applications",
      excerpt: "Best practices for creating inclusive web experiences for all users",
      date: "May 10, 2025",
      author: {
        name: "Alex Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      coverImage: "/placeholder.svg?height=400&width=600",
      slug: "building-accessible-web-applications",
    },
    {
      id: "3",
      title: "The Future of Web Development",
      excerpt: "Exploring emerging trends and technologies shaping the web",
      date: "May 5, 2025",
      author: {
        name: "Michael Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      coverImage: "/placeholder.svg?height=400&width=600",
      slug: "the-future-of-web-development",
    },
    {
      id: "4",
      title: "Optimizing Performance with React Server Components",
      excerpt: "How to leverage React Server Components for faster web applications",
      date: "April 28, 2025",
      author: {
        name: "Emily Wong",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      coverImage: "/placeholder.svg?height=400&width=600",
      slug: "optimizing-performance-with-react-server-components",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <FeaturedPost post={featuredPost} />
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Recent Posts</h2>
          <Link href="/blog">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
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
