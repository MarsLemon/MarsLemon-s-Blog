import { getAllPosts } from "@/lib/posts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, User } from "lucide-react"
import Link from "next/link"

export default async function BlogPage() {
  let posts = []

  try {
    console.log("开始获取博客列表")
    posts = await getAllPosts()
    console.log("博客列表获取成功:", posts.length)
  } catch (error) {
    console.error("获取博客列表错误:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">博客文章</h1>
          <p className="text-muted-foreground text-lg">分享技术见解与生活感悟</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {post.cover_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.cover_image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {post.is_pinned && <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">置顶</Badge>}
                      {post.is_featured && <Badge className="bg-red-500 hover:bg-red-600 text-white">精选</Badge>}
                    </div>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={post.author_avatar || ""} />
                      <AvatarFallback>
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span>{post.author_name || "匿名"}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      <span>{new Date(post.created_at).toLocaleDateString("zh-CN")}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">暂无文章</h3>
              <p className="text-muted-foreground">还没有发布任何文章，请稍后再来查看。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
