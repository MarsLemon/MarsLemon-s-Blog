import { getPosts } from "@/lib/posts"
import Link from "next/link"

export default async function Blog() {
  const posts = await getPosts()

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
