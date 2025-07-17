import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays } from "lucide-react"
import type { Post } from "@/lib/db"

interface FeaturedPostProps {
  post: Post
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section className="mb-12">
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto md:h-full">
            {post.cover_image && (
              <Image
                src={post.cover_image || "/placeholder.png"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              {post.is_featured && <Badge variant="default">精选</Badge>}
              {post.is_pinned && <Badge variant="destructive">置顶</Badge>}
            </div>
          </div>
          <div className="p-6 flex flex-col justify-center">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl font-bold line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="text-lg line-clamp-3">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
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
              <div className="mt-6">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
                >
                  阅读更多 →
                </Link>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </section>
  )
}
