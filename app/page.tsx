import { getFeaturedPost, getRecentPosts } from "@/lib/posts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, User } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  let featuredPost = null
  let recentPosts = []

  try {
    console.log("开始获取首页数据")
    featuredPost = await getFeaturedPost()
    recentPosts = await getRecentPosts(6)
    console.log("首页数据获取成功:", { featuredPost: !!featuredPost, recentPostsCount: recentPosts.length })
  } catch (error) {
    console.error("获取首页数据错误:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* 精选文章 */}
        {featuredPost && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">精选文章</h2>
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {featuredPost.cover_image && (
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={featuredPost.cover_image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">精选</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl line-clamp-2">
                  <Link href={`/blog/${featuredPost.slug}`} className="hover:text-blue-600 transition-colors">
                    {featuredPost.title}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={featuredPost.author_avatar || ""} />
                      <AvatarFallback>
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span>{featuredPost.author_name || "匿名"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>{new Date(featuredPost.created_at).toLocaleDateString("zh-CN")}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{featuredPost.excerpt}</p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 最新文章 */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">最新文章</h2>
          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {post.cover_image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.cover_image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {post.is_pinned && (
                          <Badge variant="secondary" className="bg-yellow-500 text-white">
                            置顶
                          </Badge>
                        )}
                        {post.is_featured && (
                          <Badge variant="secondary" className="bg-red-500 text-white">
                            精选
                          </Badge>
                        )}
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
                      <span>{new Date(post.created_at).toLocaleDateString("zh-CN")}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">暂无文章</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
