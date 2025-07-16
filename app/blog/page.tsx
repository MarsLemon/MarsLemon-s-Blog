import { getAllPosts } from "@/lib/posts"
import Link from "next/link"

export default async function Blog() {
  const posts = await getAllPosts()

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="mb-3">
            <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
