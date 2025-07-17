import { getAllPosts } from "@/lib/posts"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, User } from "lucide-react"

export default async function BlogPage() {
  const posts = await getAllPosts()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">技术博客</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            探索最新的技术趋势，分享开发经验，与开发者社区一起成长
          </p>
        </div>

        {/* 文章列表 */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.cover_image || "/placeholder.png"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  {post.is_pinned && (
                    <Badge className="absolute top-2 right-2" variant="destructive">
                      置顶
                    </Badge>
                  )}
                  {post.is_featured && (
                    <Badge className="absolute top-2 left-2" variant="default">
                      精选
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={post.author_avatar || "/placeholder-user.png"} />
                        <AvatarFallback>{post.author_name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{post.author_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      阅读更多 →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">暂无文章</h3>
              <p className="text-muted-foreground">目前还没有发布任何文章，请稍后再来查看。</p>
            </div>
          </div>
        )}

        {/* 分页 - 如果需要的话可以后续添加 */}
        {posts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">共 {posts.length} 篇文章</p>
          </div>
        )}
      </div>
    </div>
  )
}
