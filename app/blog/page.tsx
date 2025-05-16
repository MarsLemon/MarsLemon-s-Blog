import { PostCard } from "@/components/post-card"

export default function BlogPage() {
  // This would typically come from a CMS or API
  const allPosts = [
    {
      id: "1",
      title: "Getting Started with Next.js 15",
      excerpt: "Learn how to build modern web applications with the latest version of Next.js",
      date: "May 15, 2025",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      coverImage: "/placeholder.svg?height=400&width=600",
      slug: "getting-started-with-nextjs-15",
    },
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
    {
      id: "5",
      title: "CSS-in-JS vs. Utility-First CSS",
      excerpt: "Comparing different styling approaches for modern web applications",
      date: "April 20, 2025",
      author: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      coverImage: "/placeholder.svg?height=400&width=600",
      slug: "css-in-js-vs-utility-first-css",
    },
    {
      id: "6",
      title: "Building a Headless CMS with Next.js",
      excerpt: "A step-by-step guide to creating a flexible content management system",
      date: "April 15, 2025",
      author: {
        name: "Lisa Patel",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      coverImage: "/placeholder.svg?height=400&width=600",
      slug: "building-a-headless-cms-with-nextjs",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground">Insights, tutorials, and updates on modern web development</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {allPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
