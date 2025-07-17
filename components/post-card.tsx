import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays } from "lucide-react"
import type { Post } from "@/lib/db"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
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
  )
}
