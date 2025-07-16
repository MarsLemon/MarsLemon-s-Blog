import { getAllPosts } from "@/lib/posts"
import Link from "next/link"

export default async function Blog() {
  const posts = await getAllPosts()

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">博客</h1>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.slug} className="mb-3">
              <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:underline">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">暂无文章发布。</p>
      )}
    </main>
  )
}
